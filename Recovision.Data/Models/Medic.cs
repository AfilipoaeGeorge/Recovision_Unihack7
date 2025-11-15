using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recovision.Data.Models
{
    public class Medic
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(100)]
        public string Nume { get; set; } = null!;

        [Required, MaxLength(100)]
        public string Prenume { get; set; } = null!;

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; } = null!;

        [MaxLength(20)]
        public string Telefon { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Specializare { get; set; } = string.Empty;

        [MaxLength(50)]
        public string CodParafa { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Adresa { get; set; } = string.Empty;

        public DateTime DataAngajare { get; set; }

        public bool EsteActiv { get; set; } = true;

        [NotMapped]
        public string NumeComplet => $"{Nume} {Prenume}";
    }
}

