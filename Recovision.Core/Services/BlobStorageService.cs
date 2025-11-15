using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Recovision.Core.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Recovision.Data;
using Microsoft.EntityFrameworkCore;

namespace Recovision.Core.Services
{
    
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobContainerClient _containerClient;
        private readonly AppDbContext _context;
        public BlobStorageService(string connectionString, string containerName, AppDbContext context)
        {
            var blobServiceClient = new BlobServiceClient(connectionString);
            _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            _context = context;
            // Creează containerul dacă nu există
            //_containerClient.CreateIfNotExists(PublicAccessType.Blob);
        }
        public async Task<string> UploadImageAsync(IFormFile file, string userId)
        {
            // Generează un nume unic pentru fișier, organizat pe userId
            var fileExtension = Path.GetExtension(file.FileName);
            var blobName = $"{userId}/{Guid.NewGuid()}{fileExtension}";
            var blobClient = _containerClient.GetBlobClient(blobName);
            
            // Setează metadata și header-ele pentru tipul de conținut
            var metadata = new Dictionary<string, string>
            {
                { "userId", userId },
                { "originalFileName", file.FileName },
                { "uploadDate", DateTime.UtcNow.ToString("o") }
            };
            
            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = file.ContentType
            };

            // Upload fișierul
            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new BlobUploadOptions
                {
                    HttpHeaders = blobHttpHeaders,
                    Metadata = metadata
                });
            }
            
            // Salvează blobName în baza de date
            var userIdGuid = Guid.Parse(userId);
            var user = await _context.Users.FindAsync(userIdGuid);
            if (user != null)
            {
                user.StorageName = blobName;
                user.FileStatus = 1;
                await _context.SaveChangesAsync();
            }
            
            // Returnează URL-ul public al imaginii
            return blobClient.Uri.ToString();
        }

        public async Task<bool> DeleteImageAsync(string blobName, string userId)
        {
            // Asigură-te că blobName începe cu userId pentru securitate
            if (!blobName.StartsWith($"{userId}/"))
            {
                blobName = $"{userId}/{blobName}";
            }

            var blobClient = _containerClient.GetBlobClient(blobName);
            
            // Verifică dacă blob-ul există și aparține userului
            if (await blobClient.ExistsAsync())
            {
                var properties = await blobClient.GetPropertiesAsync();
                
                if (properties.Value.Metadata.TryGetValue("userId", out var blobUserId))
                {
                    if (blobUserId == userId)
                    {
                        return await blobClient.DeleteIfExistsAsync();
                    }
                }
            }

            return false;
        }

        public async Task<List<string>> GetUserImagesAsync(string userId)
        {
            var userImages = new List<string>();
            var prefix = $"{userId}/";

            await foreach (var blobItem in _containerClient.GetBlobsAsync(prefix: prefix))
            {
                var blobClient = _containerClient.GetBlobClient(blobItem.Name);
                userImages.Add(blobClient.Uri.ToString());
            }

            return userImages;
        }
    }
}