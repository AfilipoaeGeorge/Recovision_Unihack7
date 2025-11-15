using Recovision.Core.DTOs;
using Recovision.Core.Services;
using Recovision.Data;
using Recovision.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace Recovision.API.Controllers
{
    [Authorize(Roles = "Pacient,Medic")]
    [ApiController]
    [Route("api/[controller]")]
    public class PacientController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PacientService _pacientService;

        public PacientController(AppDbContext context, PacientService pacientService)
        {
            _context = context;
            _pacientService = pacientService;
        }

        // 🔹 GET: api/pacient/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Luăm pacientul asociat userului logat
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
              ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
              if(userId == null)
                  return Unauthorized(new { message = "ID utilizator invalid." });
              Guid currentUserId = Guid.Parse(userId);
            var user = await _context.Users
                .Include(u => u.Pacient)
                .FirstOrDefaultAsync(u => u.Id == currentUserId);

            if (user == null || user.Pacient == null)
                return NotFound(new { message = "Pacientul nu a fost găsit." });

            return Ok(user.Pacient);
        }

        // 🔹 PUT: api/pacient/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdatePacientRequest updatedData)
        {
            // Luăm userul curent
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
              ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null)
                return Unauthorized(new { message = "ID utilizator invalid." });
            Guid currentUserId = Guid.Parse(userId);
            var user = await _context.Users
                .Include(u => u.Pacient)
                .FirstOrDefaultAsync(u => u.Id == currentUserId);

            if (user == null || user.Pacient == null)
                return NotFound(new { message = "Pacientul nu a fost găsit." });

            // Actualizăm profilul pacientului
            var updated = await _pacientService.UpdatePacientProfileAsync(user.Pacient.Id, updatedData);
            if (updated == null)
                return BadRequest(new { message = "Actualizarea profilului a eșuat." });

            return Ok(new { message = "Profil actualizat cu succes.", pacient = updated });
        }

        public static DateTime? GetBirthDateFromCnp(string cnp)
        {
            if (string.IsNullOrWhiteSpace(cnp) || cnp.Length < 7)
                return null;

            int century = 0;
            switch (cnp[0])
            {
                case '1':
                case '2':
                    century = 1900;
                    break;
                case '3':
                case '4':
                    century = 1800;
                    break;
                case '5':
                case '6':
                    century = 2000;
                    break;
                case '7':
                case '8':
                case '9':
                    century = 2000; // pentru rezidenți străini
                    break;
                default:
                    return null;
            }

            int year = century + int.Parse(cnp.Substring(1, 2));
            int month = int.Parse(cnp.Substring(3, 2));
            int day = int.Parse(cnp.Substring(5, 2));

            try
            {
                return new DateTime(year, month, day);
            }
            catch
            {
                return null;
            }
        }


        [HttpGet("parsed-data")]
        public async Task<IActionResult> GetParsedData()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null)
                return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (user == null)
                return NotFound("User not found.");

            if (string.IsNullOrEmpty(user.ParsedData))
                return NotFound("No parsed data available yet.");

            var parsed = JsonSerializer.Deserialize<ParsedDataDto>(
                    user.ParsedData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

            if (parsed != null && string.IsNullOrEmpty(parsed.DataNasterii) && !string.IsNullOrEmpty(parsed.Cnp))
            {
                var birthDate = GetBirthDateFromCnp(parsed.Cnp);
                parsed.DataNasterii = birthDate?.ToString("yyyy-MM-dd");
            }

            user.FileStatus = 3;
            await _context.SaveChangesAsync();

            return Ok(parsed);
        }
        
        [HttpGet("file-status")]
        public async Task<IActionResult> GetFileStatus()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized(new { message = "Utilizator neautentificat." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (user == null)
                return NotFound(new { message = "Utilizatorul nu a fost găsit." });

            return Ok(new { fileStatus = user.FileStatus });
        }


    }
}
