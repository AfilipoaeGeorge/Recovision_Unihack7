using System;
using System.Threading.Tasks;
using Recovision.Data;
using Recovision.Data.Models;
using Recovision.Core.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Recovision.Core.Services
{
    public class PacientService
    {
        private readonly AppDbContext _context;

        public PacientService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returnează pacientul asociat unui user.
        /// </summary>
        public async Task<Pacient?> GetByUserIdAsync(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Pacient)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user?.Pacient;
        }

        /// <summary>
        /// Actualizează profilul pacientului curent.
        /// </summary>
        public async Task<Pacient?> UpdatePacientProfileAsync(Guid pacientId, UpdatePacientRequest updated)
        {
            // găsim pacientul asociat userului
            var pacient = await _context.Pacienti
                .FirstOrDefaultAsync(u => u.Id == pacientId);

            if (pacient == null)
                return null;
            

            // actualizăm câmpurile permise
            //pacient.Nume = updated.Nume ?? pacient.Nume;
            //pacient.Prenume = updated.Prenume ?? pacient.Prenume;
            pacient.CNP = updated.CNP ?? pacient.CNP;
            pacient.DataNasterii = updated.DataNasterii;
            pacient.LoculNasterii = updated.LoculNasterii ?? pacient.LoculNasterii;
            pacient.Cetatenie = updated.Cetatenie ?? pacient.Cetatenie;
            pacient.SerieCi = updated.SerieCi ?? pacient.SerieCi;
            pacient.NumarCi = updated.NumarCi ?? pacient.NumarCi;
            pacient.Adresa = updated.Adresa ?? pacient.Adresa;
            pacient.Telefon = updated.Telefon ?? pacient.Telefon;

            await _context.SaveChangesAsync();

            return pacient;
        }
    }
}
