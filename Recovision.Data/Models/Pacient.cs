using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recovision.Data.Models
{
   public class Pacient
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(100)]
    public string Nume { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Prenume { get; set; } = null!;

    [MaxLength(13)]
    public string? CNP { get; set; } = null;

    public DateOnly? DataNasterii { get; set; }

    [MaxLength(100)]
    public string LoculNasterii { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Cetatenie { get; set; } = string.Empty;

    [MaxLength(10)]
    public string SerieCi { get; set; } = string.Empty;

    [MaxLength(10)]
    public string NumarCi { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Adresa { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = null!;

    [MaxLength(20)]
    public string Telefon { get; set; } = string.Empty;

    [MaxLength(1)]
    public string Sex { get; set; } = string.Empty;

    public string? DataEmitere { get; set; }
    public string? DataExpirare { get; set; }
    public string? EmisDe { get; set; }
}

}
