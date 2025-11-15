using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Recovision.Core.DTOs;

namespace Recovision.Core.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
    }
}
