import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";

export function TripNotFound() {
  return (
    <div className="dashboard-empty">
      <h2>Trip not found</h2>
      <p>This trip doesn't exist, or you don't have access to it.</p>
      <Link to={paths.trips} className="btn btn-primary">
        Back to My Trips
      </Link>
    </div>
  );
}
