using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Recovision.Core.DTOs
{
    public class ParsedDataDto
    {
        [JsonPropertyName("cnp")]
        public string? Cnp { get; set; }

        [JsonPropertyName("nume")]
        public string? Nume { get; set; }

        [JsonPropertyName("prenume")]
        public string? Prenume { get; set; }

        [JsonPropertyName("data_nasterii")]
        public string? DataNasterii { get; set; }

        [JsonPropertyName("loc_nastere")]
        public string? LocNastere { get; set; }

        [JsonPropertyName("serie_ci")]
        public string? SerieCi { get; set; }

        [JsonPropertyName("numar_ci")]
        public string? NumarCi { get; set; }

        [JsonPropertyName("sex")]
        public string? Sex { get; set; }

        [JsonPropertyName("cetatenie")]
        public string? Cetatenie { get; set; }

        [JsonPropertyName("adresa")]
        public string? Adresa { get; set; }

        [JsonPropertyName("data_emitere")]
        public string? DataEmitere { get; set; }

        [JsonPropertyName("data_expirare")]
        public string? DataExpirare { get; set; }

        [JsonPropertyName("emis_de")]
        public string? EmisDe { get; set; }

        [JsonPropertyName("user_id")]
        public string? UserId { get; set; }

        [JsonPropertyName("image_url")]
        public string? ImageUrl { get; set; }

        [JsonPropertyName("processed_at")]
        public string? ProcessedAt { get; set; }

    }
    
    
}