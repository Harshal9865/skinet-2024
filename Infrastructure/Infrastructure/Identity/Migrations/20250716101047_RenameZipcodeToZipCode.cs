using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Infrastructure.Identity.Migrations
{
    /// <inheritdoc />
    public partial class RenameZipcodeToZipCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address_Zipcode",
                table: "AspNetUsers",
                newName: "Address_ZipCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address_ZipCode",
                table: "AspNetUsers",
                newName: "Address_Zipcode");
        }
    }
}
