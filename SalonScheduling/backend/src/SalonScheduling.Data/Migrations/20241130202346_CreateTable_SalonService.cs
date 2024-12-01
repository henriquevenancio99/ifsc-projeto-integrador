using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonScheduling.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateTable_SalonService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "salon_service",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: true),
                    service_types = table.Column<string>(type: "jsonb", nullable: false),
                    service_time = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_salon_service", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "salon_service_type",
                columns: table => new
                {
                    key = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_salon_service_type", x => x.key);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "salon_service");

            migrationBuilder.DropTable(
                name: "salon_service_type");
        }
    }
}
