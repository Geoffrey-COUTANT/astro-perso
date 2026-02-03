using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<GalleryImageEntity> GalleryImages => Set<GalleryImageEntity>();
    public DbSet<GallerySettingEntity> GallerySettings => Set<GallerySettingEntity>();
    public DbSet<MeetingEntity> Meetings => Set<MeetingEntity>();
    public DbSet<MeetingHiddenStaticEntity> MeetingHiddenStatic => Set<MeetingHiddenStaticEntity>();
    public DbSet<StaticMeetingEntity> StaticMeetings => Set<StaticMeetingEntity>();
    public DbSet<StaticGalleryMetaEntity> StaticGalleryMeta => Set<StaticGalleryMetaEntity>();
    public DbSet<ContactInfoEntity> ContactInfo => Set<ContactInfoEntity>();
    public DbSet<LinkCategoryEntity> LinkCategories => Set<LinkCategoryEntity>();
    public DbSet<LinkItemEntity> LinkItems => Set<LinkItemEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GalleryImageEntity>(e =>
        {
            e.ToTable("gallery_images");
            e.HasKey(x => x.Id);
            e.Property(x => x.FileName).HasMaxLength(256);
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.Description).HasMaxLength(2000);
        });

        modelBuilder.Entity<GallerySettingEntity>(e =>
        {
            e.ToTable("gallery_settings");
            e.HasKey(x => x.Key);
            e.Property(x => x.Key).HasMaxLength(64);
            e.Property(x => x.Value).HasColumnType("text");
        });

        modelBuilder.Entity<MeetingEntity>(e =>
        {
            e.ToTable("meetings");
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.Description).HasMaxLength(4000);
        });

        modelBuilder.Entity<MeetingHiddenStaticEntity>(e =>
        {
            e.ToTable("meeting_hidden_static");
            e.HasKey(x => x.Id);
            e.Property(x => x.StaticId).HasMaxLength(128);
        });

        modelBuilder.Entity<StaticMeetingEntity>(e =>
        {
            e.ToTable("static_meetings");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.Description).HasMaxLength(4000);
        });

        modelBuilder.Entity<StaticGalleryMetaEntity>(e =>
        {
            e.ToTable("static_gallery_meta");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.Url).HasMaxLength(2000);
        });

        modelBuilder.Entity<ContactInfoEntity>(e =>
        {
            e.ToTable("contact_info");
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.Phone).HasMaxLength(64);
            e.Property(x => x.AddressLine1).HasMaxLength(500);
            e.Property(x => x.AddressLine2).HasMaxLength(500);
        });

        modelBuilder.Entity<LinkCategoryEntity>(e =>
        {
            e.ToTable("link_categories");
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(256);
            e.HasMany(x => x.Links).WithOne().HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<LinkItemEntity>(e =>
        {
            e.ToTable("link_items");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(256);
            e.Property(x => x.Url).HasMaxLength(2000);
            e.Property(x => x.Description).HasMaxLength(1000);
        });
    }
}
