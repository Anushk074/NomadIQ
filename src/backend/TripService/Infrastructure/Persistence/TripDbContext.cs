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
    }
}
