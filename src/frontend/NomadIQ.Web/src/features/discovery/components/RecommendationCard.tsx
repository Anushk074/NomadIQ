import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { formatBestMonths, formatPerDayBudget, formatScore } from "../format";
import type { RecommendedDestinationResponse } from "../types";
import { TagList } from "./TagList";

// matchingReasons are rendered exactly as the backend returned them.
export function RecommendationCard({
  recommendation,
  rank,
}: {
  recommendation: RecommendedDestinationResponse;
  rank: number;
}) {
  const { destination, score, matchingReasons } = recommendation;

  return (
    <article className="recommendation-card">
      <div className="recommendation-header">
        <div>
          <p className="eyebrow">#{rank}</p>
          <h3>
            <Link to={paths.destinationDetails(destination.id)}>{destination.city}</Link>
          </h3>
          <p className="eyebrow">{destination.country}</p>
        </div>
        <div className="score">
          <span className="score-label">Match score</span>
          <span className="score-value">{formatScore(score)}</span>
        </div>
      </div>

      <TagList tags={destination.tags} />

      <p className="eyebrow">
        {formatPerDayBudget(destination.averageBudget)} · Best months: {formatBestMonths(destination.bestTravelMonths)}
      </p>

      <ul className="reasons">
        {matchingReasons.map((reason, index) => (
          <li key={index}>{reason}</li>
        ))}
      </ul>
    </article>
  );
}
