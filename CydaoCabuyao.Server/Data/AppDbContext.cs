using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<User> Users { get; set; }
  public DbSet<CydaoProgram> Programs { get; set; }
  public DbSet<CydaoEvent> Events { get; set; }
  public DbSet<Application> Applications { get; set; }
  public DbSet<EventRegistration> EventRegistrations { get; set; }
  public DbSet<Announcement> Announcements { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<User>(e =>
    {
      e.HasIndex(u => u.Email).IsUnique();
      e.Property(u => u.Role).HasConversion<string>();
      e.Property(u => u.Barangay).HasConversion<string>();
    });

    modelBuilder.Entity<Application>(e =>
    {
      e.Property(a => a.Status).HasConversion<string>();
    });

    modelBuilder.Entity<CydaoProgram>(e =>
    {
      e.Property(p => p.Category).HasConversion<string>();
    });

    modelBuilder.Entity<Announcement>(e =>
    {
      e.Property(a => a.Category).HasConversion<string>();
    });

    modelBuilder.Entity<CydaoEvent>().ToTable("Events");
    modelBuilder.Entity<EventRegistration>().ToTable("EventRegistrations");
  }
}
