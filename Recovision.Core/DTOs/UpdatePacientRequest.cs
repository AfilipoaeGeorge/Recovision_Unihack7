using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Recovision.Core.DTOs
{
    public class UpdatePacientRequest
    {
        //public string Nume { get; set; }
        //public string Prenume { get; set; }
        public string? CNP { get; set; }
        public DateOnly DataNasterii { get; set; }
        public string? LoculNasterii { get; set; }
        public string? Cetatenie { get; set; }
        public string? SerieCi { get; set; }
        public string? NumarCi { get; set; }
        public string? Adresa { get; set; }
        public string? AnUniversitar { get; set; }  
        public string? Facultate { get; set; }
        public string? Specializare { get; set; }
        public int AnDeStudiu { get; set; }
        public string? Telefon { get; set; }
        public double MedieGenerala { get; set; }
    }
}
