using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations;

public partial class StaticDataInDb : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "static_meetings",
            columns: table => new
            {
                Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                Title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_static_meetings", x => x.Id));

        migrationBuilder.CreateTable(
            name: "static_gallery_meta",
            columns: table => new
            {
                Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                Title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                Url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                DisplayOrder = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_static_gallery_meta", x => x.Id));
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "static_meetings");
        migrationBuilder.DropTable(name: "static_gallery_meta");
    }
}
