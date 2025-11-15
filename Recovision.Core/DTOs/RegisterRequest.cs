using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Recovision.Core.DTOs
{
      public class RegisterRequest
    {
        [Required] public string Nume { get; set; } = null!;
        [Required] public string Prenume { get; set; } = null!;
        [Required, EmailAddress] public string Email { get; set; } = null!;
        [Required, MinLength(6)] public string Password { get; set; } = null!;
        public string? Role { get; set; }  
    }
}