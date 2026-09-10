using System.ComponentModel.DataAnnotations;

namespace AIService.Application.Dtos;

public record TripPlanRequest(
    [Range(1, double.MaxValue)] decimal Budget,
    [Range(1, 30)] int DurationDays,
    [Required, StringLength(50, MinimumLength = 1)] string TravelStyle,
    string[]? Preferences = null,
    [StringLength(100, MinimumLength = 1)] string? Destination = null,
    [Range(1, 20)] int NumberOfTravelers = 1,
    DateOnly? TravelStartDate = null
);
