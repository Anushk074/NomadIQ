import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { formatBestMonths, formatPerDayBudget } from "../format";
import type { DestinationResponse } from "../types";
import { TagList } from "./TagList";

export function DestinationCard({ destination }: { destination: DestinationResponse }) {
  return (
    <Link to={paths.destinationDetails(destination.id)} className="destination-card">
      <div>
        <h3>{destination.city}</h3>
        <p className="eyebrow">{destination.country}</p>
      </div>

      <p className="destination-description">{destination.description}</p>

      <TagList tags={destination.tags} />

      <dl className="destination-facts">
        <div>
          <dt>Typical cost</dt>
          <dd>{formatPerDayBudget(destination.averageBudget)}</dd>
        </div>
        <div>
          <dt>Best months</dt>
          <dd>{formatBestMonths(destination.bestTravelMonths)}</dd>
        </div>
      </dl>
    </Link>
  );
}
