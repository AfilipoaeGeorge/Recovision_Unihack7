using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Recovision.Core.DTOs;
using Recovision.Core.Interfaces;


namespace Recovision.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterRequest request)
{
    try
    {
        var result = await _authService.RegisterAsync(request);

        // ✅ returnăm obiectul complet, nu doar mesajul
        return Ok(result);
    }
    catch (Exception ex)
    {
        return BadRequest(new RegisterResponse
        {
            Success = false,
            Message = ex.Message
        });
    }
}


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

}