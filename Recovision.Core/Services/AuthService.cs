using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Recovision.Core.DTOs;
using Recovision.Core.Interfaces;
using Recovision.Data;
using Recovision.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Recovision.Core.Services
{
    public partial class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            // 1️⃣ Validare email
            if (string.IsNullOrWhiteSpace(request.Email) || !IsValidEmail(request.Email))
            {
                return new RegisterResponse
                {
                    Success = false,
                    Message = "Emailul nu este valid.",
                };
            }

            // 2️⃣ Verifică dacă există deja user
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return new RegisterResponse
                {
                    Success = false,
                    Message = "Există deja un cont cu acest email.",
                };
            }

            // 3️⃣ Hash parolă
            var passwordHash = HashPassword(request.Password);

            // 4️⃣ Determină rolul (default: Pacient)
            var role = string.IsNullOrWhiteSpace(request.Role) ? "Pacient" : request.Role;
            if (role != "Pacient" && role != "Medic")
            {
                return new RegisterResponse
                {
                    Success = false,
                    Message = "Rolul trebuie să fie 'Pacient' sau 'Medic'.",
                };
            }

            Guid? pacientId = null;
            Guid? medicId = null;

            // 5️⃣ Creează Pacient sau Medic în funcție de rol
            if (role == "Pacient")
            {
                var pacient = await _context.Pacienti.FirstOrDefaultAsync(s =>
                    s.Email == request.Email
                );
                if (pacient == null)
                {
                    pacient = new Pacient
                    {
                        Id = Guid.NewGuid(),
                        Nume = request.Nume,
                        Prenume = request.Prenume,
                        Email = request.Email,
                        Adresa = "",
                        Telefon = "",
                        Cetatenie = "",
                        LoculNasterii = "",
                        NumarCi = "",
                        SerieCi = "",
                    };
                    _context.Pacienti.Add(pacient);
                    await _context.SaveChangesAsync();
                }
                pacientId = pacient.Id;
            }
            else if (role == "Medic")
            {
                var medic = await _context.Medici.FirstOrDefaultAsync(m =>
                    m.Email == request.Email
                );
                if (medic == null)
                {
                    medic = new Medic
                    {
                        Id = Guid.NewGuid(),
                        Nume = request.Nume,
                        Prenume = request.Prenume,
                        Email = request.Email,
                        Telefon = "",
                        Specializare = "",
                        CodParafa = "",
                        Adresa = "",
                        DataAngajare = DateTime.UtcNow,
                        EsteActiv = true,
                    };
                    _context.Medici.Add(medic);
                    await _context.SaveChangesAsync();
                }
                medicId = medic.Id;
            }

            // 6️⃣ Creează user
            var user = new User
            {
                Id = Guid.NewGuid(),
                Nume = request.Nume,
                Prenume = request.Prenume,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = role,
                DataCreare = DateTime.UtcNow,
                EsteActiv = true,
                PacientId = pacientId,
                MedicId = medicId,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new RegisterResponse { Success = true, Message = "Cont creat cu succes!" };
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Email sau parolă incorectă.");

            if (!user.EsteActiv)
                throw new UnauthorizedAccessException("Contul este dezactivat.");

            var IsFirstLogin = user.UltimaAutentificare == null;
            Console.WriteLine($"🧠 Este prima autentificare pentru {user.Email}? {IsFirstLogin}");
            
            user.UltimaAutentificare = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                NumeComplet = user.NumeComplet,
                IsFirstLogin = IsFirstLogin,
            };
        }

        public async Task<RegisterResponse> ConfirmAccountAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return new RegisterResponse { Success = false, Message = "Contul nu există." };
            }

            if (user.EsteActiv)
            {
                return new RegisterResponse
                {
                    Success = false,
                    Message = "Contul este deja activat.",
                };
            }

            user.EsteActiv = true;
            await _context.SaveChangesAsync();

            return new RegisterResponse
            {
                Success = true,
                Message = "Contul tău a fost confirmat cu succes! 🎉",
            };
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }

        private bool VerifyPassword(string password, string hash) => HashPassword(password) == hash;

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var jwtKey = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
                throw new InvalidOperationException("JWT key is missing.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;
            
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
