using System.ComponentModel.DataAnnotations;

namespace DiscoveryService.Application.Dtos;

public record DestinationRecommendationRequest(
    [Range(1, double.MaxValue)] decimal Budget,
    [Range(1, 365)] int DurationDays,
    [Required, StringLength(50, MinimumLength = 1)] string TravelStyle,
    string[]? Preferences = null,
    [Range(1, 12)] int? TravelMonth = null
);
