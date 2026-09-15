using TripService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TripService.Infrastructure.Persistence;

public class TripDbContext : DbContext
{
    public TripDbContext(DbContextOptions<TripDbContext> options)
        : base(options)
    {
    }

    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<ItineraryDay> ItineraryDays => Set<ItineraryDay>();
    public DbSet<Activity> Activities => Set<Activity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Trip>(entity =>
        {
            entity.ToTable("Trips");
            entity.HasKey(t => t.Id);

            entity.Property(t => t.Destination)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(t => t.Currency)
                .IsRequired()
                .HasMaxLength(3);

            entity.Property(t => t.TravelStyle)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(t => t.Budget)
                .HasPrecision(18, 2);

            entity.Property(t => t.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.HasIndex(t => t.UserId);
        });

        modelBuilder.Entity<ItineraryDay>(entity =>
        {
            entity.ToTable("ItineraryDays");
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Title)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(d => d.Notes)
                .HasMaxLength(1000);

            entity.HasIndex(d => new { d.TripId, d.DayNumber })
                .IsUnique();

            entity.HasOne(d => d.Trip)
                .WithMany(t => t.Days)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Activity>(entity =>
        {
            entity.ToTable("Activities");
            entity.HasKey(a => a.Id);

            entity.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(a => a.Description)
                .HasMaxLength(1000);

            entity.Property(a => a.Location)
                .HasMaxLength(200);

            entity.Property(a => a.EstimatedCost)
                .HasPrecision(18, 2);

            entity.HasOne(a => a.ItineraryDay)
                .WithMany(d => d.Activities)
                .HasForeignKey(a => a.ItineraryDayId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
