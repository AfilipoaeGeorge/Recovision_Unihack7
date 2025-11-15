using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Recovision.Data.Models;

 public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Nume { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Prenume { get; set; } = null!;

        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "Pacient"; // implicit Pacient

        public DateTime DataCreare { get; set; } 

        public DateTime? UltimaAutentificare { get; set; }

        public bool EsteActiv { get; set; } = true;

        // Relatie cu Pacient
        public Guid? PacientId { get; set; }

        [ForeignKey("PacientId")]
        public virtual Pacient? Pacient { get; set; }

        // Relatie cu Medic
        public Guid? MedicId { get; set; }

        [ForeignKey("MedicId")]
        public virtual Medic? Medic { get; set; }
        
        public string? StorageName { get; set; }

        public int? FileStatus { get; set; }

        public string? ParsedData { get; set; }
    [NotMapped]
        public string NumeComplet => $"{Nume} {Prenume}";
        
    }