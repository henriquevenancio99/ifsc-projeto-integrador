using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonScheduling.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterTable_Scheduling_RemoveColumnTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "title",
                table: "scheduling");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "scheduling",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
