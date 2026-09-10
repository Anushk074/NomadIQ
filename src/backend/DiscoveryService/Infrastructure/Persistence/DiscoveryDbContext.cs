using DiscoveryService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DiscoveryService.Infrastructure.Persistence;

public class DiscoveryDbContext : DbContext
{
    public DiscoveryDbContext(DbContextOptions<DiscoveryDbContext> options)
        : base(options)
    {
    }

    public DbSet<Destination> Destinations => Set<Destination>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Destination>(entity =>
        {
            entity.ToTable("Destinations");
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Country)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(d => d.City)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(d => d.Description)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(d => d.Tags)
                .IsRequired();

            entity.Property(d => d.AverageBudget)
                .HasPrecision(18, 2);

            entity.Property(d => d.BestTravelMonths)
                .IsRequired();

            entity.HasIndex(d => d.City);

            entity.HasData(DestinationSeedData.Destinations);
        });
    }
}
