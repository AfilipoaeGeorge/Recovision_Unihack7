using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace Recovision.Core.DTOs
{
    public class LoginRequest
    {
        [Required, EmailAddress] public string Email { get; set; } = null!;
        [Required] public string Password { get; set; } = null!;
    }
}