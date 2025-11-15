using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Recovision.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IO;
using Swashbuckle.AspNetCore.Annotations;

namespace Recovision.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Necesită autentificare pentru toate endpoint-urile
    public class ImageUploadController : ControllerBase
    {
        private readonly IBlobStorageService _blobStorageService;

        public ImageUploadController(IBlobStorageService blobStorageService)
        {
            _blobStorageService = blobStorageService;
        }

        
        [HttpPost("upload")]
        [RequestSizeLimit(10_000_000)] // 10MB limit
       
        public async Task<IActionResult> UploadImage( IFormFile file)
        {
            try
            {
                // Obține userId din token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User ID nu a fost găsit în token" });
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "Niciun fișier nu a fost trimis" });
                }

                // Validare tip imagine
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Doar fișiere imagine sunt permise (jpg, jpeg, png, gif, webp)" });
                }

                // Validare tip MIME
                var allowedMimeTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
                if (!allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
                {
                    return BadRequest(new { message = "Tipul de fișier nu este valid" });
                }

                // Upload în blob storage cu userId pentru organizare
                var imageUrl = await _blobStorageService.UploadImageAsync(file, userId);

                return Ok(new 
                { 
                    message = "Imaginea a fost încărcată cu succes",
                    url = imageUrl,
                    fileName = file.FileName,
                    size = file.Length,
                    userId = userId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Eroare la încărcarea imaginii", error = ex.Message });
            }
        }

        [HttpDelete("delete/{blobName}")]
        public async Task<IActionResult> DeleteImage(string blobName)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User ID nu a fost găsit în token" });
                }

                // Verifică că blobName aparține userului (opțional, pentru securitate)
                var result = await _blobStorageService.DeleteImageAsync(blobName, userId);
                
                if (result)
                {
                    return Ok(new { message = "Imaginea a fost ștearsă cu succes" });
                }
                
                return NotFound(new { message = "Imaginea nu a fost găsită sau nu aparține utilizatorului" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Eroare la ștergerea imaginii", error = ex.Message });
            }
        }

        [HttpGet("my-images")]
        public async Task<IActionResult> GetMyImages()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User ID nu a fost găsit în token" });
                }

                var images = await _blobStorageService.GetUserImagesAsync(userId);
                
                return Ok(new { images });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Eroare la obținerea imaginilor", error = ex.Message });
            }
        }
    }
}