using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Recovision.Core.Interfaces
{
    public interface IBlobStorageService
    {
        Task<string> UploadImageAsync(IFormFile file, string userId);
        Task<bool> DeleteImageAsync(string blobName, string userId);
        Task<List<string>> GetUserImagesAsync(string userId);
    }
}