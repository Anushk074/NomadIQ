import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";

export function EmptyTripsState() {
  return (
    <div className="dashboard-empty">
      <h2>No trips yet</h2>
      <p>Start planning your first trip and it will show up here.</p>
      <Link to={paths.newTrip} className="btn btn-primary">
        Create your first trip
      </Link>
    </div>
  );
}
