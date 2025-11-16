using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Recovision.Core.DTOs
{
    public class UpdatePacientRequest
{
    public string? Cnp { get; set; }
    public string? Nume { get; set; }
    public string? Prenume { get; set; }
    public string? Data_Nasterii { get; set; }
    public string? Loc_Nastere { get; set; }
    public string? Serie_Ci { get; set; }
    public string? Numar_Ci { get; set; }
    public string? Sex { get; set; }
    public string? Cetatenie { get; set; }
    public string? Adresa { get; set; }
    public string? Telefon { get; set; } 
    public string? Data_Emitere { get; set; }
    public string? Data_Expirare { get; set; }
    public string? Emis_De { get; set; }
}

}
