using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonScheduling.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterTable_Employee_BindWithSalonServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "employee_salon_service",
                columns: table => new
                {
                    employees_id = table.Column<Guid>(type: "uuid", nullable: false),
                    salon_services_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_employee_salon_service", x => new { x.employees_id, x.salon_services_id });
                    table.ForeignKey(
                        name: "fk_employee_salon_service_employee_employees_id",
                        column: x => x.employees_id,
                        principalTable: "employee",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_employee_salon_service_salon_service_salon_services_id",
                        column: x => x.salon_services_id,
                        principalTable: "salon_service",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_employee_salon_service_salon_services_id",
                table: "employee_salon_service",
                column: "salon_services_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "employee_salon_service");
        }
    }
}
