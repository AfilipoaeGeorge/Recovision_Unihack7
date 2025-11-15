using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Recovision.Core.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; } = null!;
        public Guid UserId { get; set; }
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string NumeComplet { get; set; } = null!;

        public bool IsFirstLogin { get; set; }
    }
}