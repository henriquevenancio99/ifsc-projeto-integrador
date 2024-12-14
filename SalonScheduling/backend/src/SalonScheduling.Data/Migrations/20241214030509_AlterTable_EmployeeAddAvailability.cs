using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using SalonScheduling.Domain.Dtos.Employee;

#nullable disable

namespace SalonScheduling.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterTable_EmployeeAddAvailability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<string, WorkShiftDto[]>>(
                name: "availability",
                table: "employee",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "availability",
                table: "employee");
        }
    }
}
