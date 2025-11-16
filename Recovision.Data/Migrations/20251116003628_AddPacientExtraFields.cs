using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recovision.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPacientExtraFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DataEmitere",
                table: "Pacienti",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DataExpirare",
                table: "Pacienti",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmisDe",
                table: "Pacienti",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sex",
                table: "Pacienti",
                type: "character varying(1)",
                maxLength: 1,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataEmitere",
                table: "Pacienti");

            migrationBuilder.DropColumn(
                name: "DataExpirare",
                table: "Pacienti");

            migrationBuilder.DropColumn(
                name: "EmisDe",
                table: "Pacienti");

            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Pacienti");
        }
    }
}
