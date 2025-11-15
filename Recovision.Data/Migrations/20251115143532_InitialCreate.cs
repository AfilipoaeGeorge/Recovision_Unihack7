using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recovision.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Medici",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Prenume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Specializare = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CodParafa = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Adresa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DataAngajare = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EsteActiv = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medici", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pacienti",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Prenume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CNP = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: true),
                    DataNasterii = table.Column<DateOnly>(type: "date", nullable: true),
                    LoculNasterii = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Cetatenie = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SerieCi = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    NumarCi = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Adresa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    AnUniversitar = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Facultate = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Specializare = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AnDeStudiu = table.Column<int>(type: "integer", nullable: true),
                    MedieGenerala = table.Column<double>(type: "double precision", nullable: true),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacienti", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Prenume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DataCreare = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UltimaAutentificare = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EsteActiv = table.Column<bool>(type: "boolean", nullable: false),
                    PacientId = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicId = table.Column<Guid>(type: "uuid", nullable: true),
                    StorageName = table.Column<string>(type: "text", nullable: true),
                    FileStatus = table.Column<int>(type: "integer", nullable: true),
                    ParsedData = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Medici_MedicId",
                        column: x => x.MedicId,
                        principalTable: "Medici",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Users_Pacienti_PacientId",
                        column: x => x.PacientId,
                        principalTable: "Pacienti",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Medici_CodParafa",
                table: "Medici",
                column: "CodParafa",
                unique: true,
                filter: "\"CodParafa\" IS NOT NULL AND \"CodParafa\" != ''");

            migrationBuilder.CreateIndex(
                name: "IX_Medici_Email",
                table: "Medici",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pacienti_CNP",
                table: "Pacienti",
                column: "CNP",
                unique: true,
                filter: "\"CNP\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Pacienti_Email",
                table: "Pacienti",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_MedicId",
                table: "Users",
                column: "MedicId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_PacientId",
                table: "Users",
                column: "PacientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Medici");

            migrationBuilder.DropTable(
                name: "Pacienti");
        }
    }
}
