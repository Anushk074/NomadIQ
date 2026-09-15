using System.ComponentModel.DataAnnotations;

namespace TripService.Application.Dtos;

public record CreateActivityRequest(
    [Required, StringLength(150, MinimumLength = 1)] string Name,
    [StringLength(1000)] string? Description = null,
    [StringLength(200)] string? Location = null,
    [Range(0, double.MaxValue)] decimal? EstimatedCost = null,
    TimeOnly? StartTime = null,
    TimeOnly? EndTime = null
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartTime is not null && EndTime is not null && EndTime <= StartTime)
        {
            yield return new ValidationResult("EndTime must be after StartTime.", new[] { nameof(EndTime) });
        }
    }
}
