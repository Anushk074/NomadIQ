using System.ComponentModel.DataAnnotations;
using TripService.Domain.Enums;

namespace TripService.Application.Dtos;

public record UpdateTripRequest(
    [Required, StringLength(200, MinimumLength = 1)] string Destination,
    DateOnly StartDate,
    DateOnly EndDate,
    [Range(0, double.MaxValue)] decimal Budget,
    [Required, StringLength(3, MinimumLength = 3)] string Currency,
    [Required, StringLength(50, MinimumLength = 1)] string TravelStyle,
    TripStatus Status
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartDate == default)
        {
            yield return new ValidationResult("StartDate is required.", new[] { nameof(StartDate) });
        }

        if (EndDate == default)
        {
            yield return new ValidationResult("EndDate is required.", new[] { nameof(EndDate) });
        }

        if (EndDate < StartDate)
        {
            yield return new ValidationResult("EndDate must be on or after StartDate.", new[] { nameof(EndDate) });
        }
    }
}
