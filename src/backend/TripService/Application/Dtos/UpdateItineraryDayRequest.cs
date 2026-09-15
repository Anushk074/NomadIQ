using System.ComponentModel.DataAnnotations;

namespace TripService.Application.Dtos;

public record UpdateItineraryDayRequest(
    [Range(1, 365)] int DayNumber,
    DateOnly Date,
    [Required, StringLength(150, MinimumLength = 1)] string Title,
    [StringLength(1000)] string? Notes = null
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Date == default)
        {
            yield return new ValidationResult("Date is required.", new[] { nameof(Date) });
        }
    }
}
