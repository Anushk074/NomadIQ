using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DiscoveryService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Destinations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Tags = table.Column<string[]>(type: "text[]", nullable: false),
                    AverageBudget = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    BestTravelMonths = table.Column<int[]>(type: "integer[]", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destinations", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Destinations",
                columns: new[] { "Id", "AverageBudget", "BestTravelMonths", "City", "Country", "CreatedAt", "Description", "Tags", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), 3000m, new[] { 10, 11, 12, 1, 2, 3 }, "Munnar", "India", new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc), "A serene hill station in Kerala known for sprawling tea plantations, misty mountains, and a cool, relaxed atmosphere.", new[] { "nature", "relaxed", "hills", "tea plantations", "honeymoon" }, new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("22222222-2222-2222-2222-222222222222"), 3500m, new[] { 3, 4, 5, 6, 12, 1, 2 }, "Manali", "India", new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc), "A popular Himalayan hill town in Himachal Pradesh offering adventure sports, snow-capped peaks, and vibrant markets.", new[] { "adventure", "mountains", "snow", "trekking", "nightlife" }, new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("33333333-3333-3333-3333-333333333333"), 2800m, new[] { 10, 11, 12, 1, 2, 3 }, "Coorg", "India", new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc), "A lush coffee-growing district in Karnataka known as the 'Scotland of India', with waterfalls, forests, and a laid-back pace.", new[] { "nature", "coffee", "relaxed", "waterfalls", "honeymoon" }, new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("44444444-4444-4444-4444-444444444444"), 2500m, new[] { 4, 5, 6, 9, 10, 11 }, "Ooty", "India", new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc), "A colonial-era hill station in the Nilgiris known for tea estates, botanical gardens, and pleasant year-round weather.", new[] { "nature", "hills", "family", "gardens", "relaxed" }, new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Destinations_City",
                table: "Destinations",
                column: "City");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Destinations");
        }
    }
}
