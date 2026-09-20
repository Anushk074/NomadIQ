import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";

const actions: Array<{ to: string; label: string }> = [
  { to: paths.newTrip, label: "Create Trip" },
  { to: paths.trips, label: "My Trips" },
  { to: paths.discovery, label: "Discover" },
  { to: paths.planner, label: "AI Planner" },
  { to: paths.assistant, label: "AI Assistant" },
];

export function QuickActions() {
  return (
    <nav className="quick-actions" aria-label="Quick actions">
      <ul>
        {actions.map((action) => (
          <li key={action.to}>
            <Link to={action.to}>{action.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
