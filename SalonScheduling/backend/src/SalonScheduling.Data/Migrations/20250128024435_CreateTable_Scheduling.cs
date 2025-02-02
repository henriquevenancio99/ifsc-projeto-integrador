using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonScheduling.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateTable_Scheduling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "scheduling",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    start = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_scheduling", x => x.id);
                    table.ForeignKey(
                        name: "fk_scheduling_client_client_id",
                        column: x => x.client_id,
                        principalTable: "client",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "employee_scheduling",
                columns: table => new
                {
                    employees_id = table.Column<Guid>(type: "uuid", nullable: false),
                    schedulings_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_employee_scheduling", x => new { x.employees_id, x.schedulings_id });
                    table.ForeignKey(
                        name: "fk_employee_scheduling_employee_employees_id",
                        column: x => x.employees_id,
                        principalTable: "employee",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_employee_scheduling_scheduling_schedulings_id",
                        column: x => x.schedulings_id,
                        principalTable: "scheduling",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "salon_service_scheduling",
                columns: table => new
                {
                    salon_services_id = table.Column<Guid>(type: "uuid", nullable: false),
                    schedulings_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_salon_service_scheduling", x => new { x.salon_services_id, x.schedulings_id });
                    table.ForeignKey(
                        name: "fk_salon_service_scheduling_salon_service_salon_services_id",
                        column: x => x.salon_services_id,
                        principalTable: "salon_service",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_salon_service_scheduling_scheduling_schedulings_id",
                        column: x => x.schedulings_id,
                        principalTable: "scheduling",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_employee_scheduling_schedulings_id",
                table: "employee_scheduling",
                column: "schedulings_id");

            migrationBuilder.CreateIndex(
                name: "ix_salon_service_scheduling_schedulings_id",
                table: "salon_service_scheduling",
                column: "schedulings_id");

            migrationBuilder.CreateIndex(
                name: "ix_scheduling_client_id",
                table: "scheduling",
                column: "client_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "employee_scheduling");

            migrationBuilder.DropTable(
                name: "salon_service_scheduling");

            migrationBuilder.DropTable(
                name: "scheduling");
        }
    }
}
