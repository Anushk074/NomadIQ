using DiscoveryService.Domain.Entities;

namespace DiscoveryService.Infrastructure.Persistence;

// Fixed ids/timestamps are required because EF Core bakes HasData rows into
// the migration snapshot — any non-deterministic value here would show up as
// a perpetual pending model change.
public static class DestinationSeedData
{
    private static readonly DateTime SeededAt = new(2026, 9, 10, 0, 0, 0, DateTimeKind.Utc);

    public static Destination[] Destinations { get; } =
    [
        new Destination
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Country = "India",
            City = "Munnar",
            Description = "A serene hill station in Kerala known for sprawling tea plantations, misty mountains, and a cool, relaxed atmosphere.",
            Tags = ["nature", "relaxed", "hills", "tea plantations", "honeymoon"],
            AverageBudget = 3000m,
            BestTravelMonths = [10, 11, 12, 1, 2, 3],
            CreatedAt = SeededAt,
            UpdatedAt = SeededAt
        },
        new Destination
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Country = "India",
            City = "Manali",
            Description = "A popular Himalayan hill town in Himachal Pradesh offering adventure sports, snow-capped peaks, and vibrant markets.",
            Tags = ["adventure", "mountains", "snow", "trekking", "nightlife"],
            AverageBudget = 3500m,
            BestTravelMonths = [3, 4, 5, 6, 12, 1, 2],
            CreatedAt = SeededAt,
            UpdatedAt = SeededAt
        },
        new Destination
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Country = "India",
            City = "Coorg",
            Description = "A lush coffee-growing district in Karnataka known as the 'Scotland of India', with waterfalls, forests, and a laid-back pace.",
            Tags = ["nature", "coffee", "relaxed", "waterfalls", "honeymoon"],
            AverageBudget = 2800m,
            BestTravelMonths = [10, 11, 12, 1, 2, 3],
            CreatedAt = SeededAt,
            UpdatedAt = SeededAt
        },
        new Destination
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            Country = "India",
            City = "Ooty",
            Description = "A colonial-era hill station in the Nilgiris known for tea estates, botanical gardens, and pleasant year-round weather.",
            Tags = ["nature", "hills", "family", "gardens", "relaxed"],
            AverageBudget = 2500m,
            BestTravelMonths = [4, 5, 6, 9, 10, 11],
            CreatedAt = SeededAt,
            UpdatedAt = SeededAt
        }
    ];
}
