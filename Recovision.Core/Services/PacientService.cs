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
            var pacient = await _context.Pacienti.FirstOrDefaultAsync(u => u.Id == pacientId);
            if (pacient == null)
                return null;

            pacient.CNP = updated.Cnp ?? pacient.CNP;
            pacient.Nume = updated.Nume ?? pacient.Nume;
            pacient.Prenume = updated.Prenume ?? pacient.Prenume;
            pacient.LoculNasterii = updated.Loc_Nastere ?? pacient.LoculNasterii;
            pacient.Cetatenie = updated.Cetatenie ?? pacient.Cetatenie;
            pacient.SerieCi = updated.Serie_Ci ?? pacient.SerieCi;
            pacient.NumarCi = updated.Numar_Ci ?? pacient.NumarCi;
            pacient.Adresa = updated.Adresa ?? pacient.Adresa;
            pacient.Sex = updated.Sex ?? pacient.Sex;
            pacient.Telefon = updated.Telefon ?? pacient.Telefon;
            pacient.DataEmitere = updated.Data_Emitere ?? pacient.DataEmitere;
            pacient.DataExpirare = updated.Data_Expirare ?? pacient.DataExpirare;
            pacient.EmisDe = updated.Emis_De ?? pacient.EmisDe;

            if (DateOnly.TryParse(updated.Data_Nasterii, out var dn))
                pacient.DataNasterii = dn;

            await _context.SaveChangesAsync();
            return pacient;
        }

    }
}
