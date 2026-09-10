using DiscoveryService.Application.Abstractions;
using DiscoveryService.Application.Dtos;
using DiscoveryService.Domain.Entities;
using DiscoveryService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DiscoveryService.Application.Services;

// Recommendation scoring is deterministic by design (Phase 3 explicitly
// excludes AI/ML): the same request against the same catalog always
// produces the same scores, in the same order, with the same reasons.
public class DestinationService : IDestinationService
{
    private const decimal BudgetWeight = 40m;
    private const decimal TagWeight = 40m;
    private const decimal SeasonWeight = 20m;

    private readonly DiscoveryDbContext _dbContext;

    public DestinationService(DiscoveryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<DestinationResponse>> GetDestinationsAsync(CancellationToken cancellationToken = default)
    {
        var destinations = await _dbContext.Destinations
            .OrderBy(d => d.City)
            .ToListAsync(cancellationToken);

        return destinations.Select(ToResponse).ToList();
    }

    public async Task<DestinationResponse?> GetDestinationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var destination = await _dbContext.Destinations
            .SingleOrDefaultAsync(d => d.Id == id, cancellationToken);

        return destination is null ? null : ToResponse(destination);
    }

    public async Task<IReadOnlyList<RecommendedDestinationResponse>> GetRecommendationsAsync(DestinationRecommendationRequest request, CancellationToken cancellationToken = default)
    {
        var destinations = await _dbContext.Destinations.ToListAsync(cancellationToken);

        var requestedTags = BuildRequestedTagSet(request);

        return destinations
            .Select(destination => Score(destination, request, requestedTags))
            .OrderByDescending(recommendation => recommendation.Score)
            .ThenBy(recommendation => recommendation.Destination.City, StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static HashSet<string> BuildRequestedTagSet(DestinationRecommendationRequest request)
    {
        var tags = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var tag in request.Preferences ?? Array.Empty<string>())
        {
            if (!string.IsNullOrWhiteSpace(tag))
            {
                tags.Add(tag.Trim());
            }
        }

        if (!string.IsNullOrWhiteSpace(request.TravelStyle))
        {
            tags.Add(request.TravelStyle.Trim());
        }

        return tags;
    }

    private static RecommendedDestinationResponse Score(
        Destination destination,
        DestinationRecommendationRequest request,
        HashSet<string> requestedTags)
    {
        var reasons = new List<string>();

        var budgetScore = ScoreBudget(destination, request, reasons);
        var tagScore = ScoreTags(destination, requestedTags, reasons);
        var seasonScore = ScoreSeason(destination, request, reasons);

        var totalScore = Math.Round(budgetScore + tagScore + seasonScore, 1);

        return new RecommendedDestinationResponse(ToResponse(destination), totalScore, reasons.ToArray());
    }

    private static decimal ScoreBudget(Destination destination, DestinationRecommendationRequest request, List<string> reasons)
    {
        var budgetPerDay = request.Budget / request.DurationDays;

        if (destination.AverageBudget <= 0)
        {
            reasons.Add($"{destination.City} has no recorded average cost, so budget fit was scored as fully affordable.");
            return BudgetWeight;
        }

        var coverageRatio = Math.Min(1m, budgetPerDay / destination.AverageBudget);
        var score = coverageRatio * BudgetWeight;
        var coveragePercentage = Math.Round(coverageRatio * 100m, 0);

        reasons.Add(
            $"Your budget of {budgetPerDay:0.##}/day covers {coveragePercentage}% of {destination.City}'s typical {destination.AverageBudget:0.##}/day cost.");

        return score;
    }

    private static decimal ScoreTags(Destination destination, HashSet<string> requestedTags, List<string> reasons)
    {
        if (requestedTags.Count == 0)
        {
            reasons.Add("No specific preferences or travel style were provided, so this factor was not scored against.");
            return TagWeight;
        }

        var matchedTags = destination.Tags
            .Where(tag => requestedTags.Contains(tag))
            .ToList();

        var score = (decimal)matchedTags.Count / requestedTags.Count * TagWeight;

        reasons.Add(matchedTags.Count == 0
            ? "None of your requested preferences or travel style matched this destination's tags."
            : $"Matches {matchedTags.Count} of {requestedTags.Count} requested preferences: {string.Join(", ", matchedTags)}.");

        return score;
    }

    private static decimal ScoreSeason(Destination destination, DestinationRecommendationRequest request, List<string> reasons)
    {
        if (request.TravelMonth is null)
        {
            reasons.Add("Travel month was not specified, so seasonal fit was not scored.");
            return SeasonWeight;
        }

        var month = request.TravelMonth.Value;

        if (destination.BestTravelMonths.Contains(month))
        {
            reasons.Add($"{destination.City} is a great fit for {MonthName(month)}.");
            return SeasonWeight;
        }

        var bestMonths = string.Join(", ", destination.BestTravelMonths.OrderBy(m => m).Select(MonthName));
        reasons.Add($"{MonthName(month)} is outside {destination.City}'s best travel months ({bestMonths}).");

        return 0m;
    }

    private static string MonthName(int month) => new DateTime(2000, month, 1).ToString("MMMM");

    private static DestinationResponse ToResponse(Destination destination) => new(
        destination.Id,
        destination.Country,
        destination.City,
        destination.Description,
        destination.Tags,
        destination.AverageBudget,
        destination.BestTravelMonths,
        destination.CreatedAt,
        destination.UpdatedAt);
}
