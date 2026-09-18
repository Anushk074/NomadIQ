import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";
import { paths } from "../routes/paths";

const appLinks: Array<{ to: string; label: string }> = [
  { to: paths.dashboard, label: "Dashboard" },
  { to: paths.trips, label: "Trips" },
  { to: paths.discovery, label: "Discover" },
  { to: paths.assistant, label: "AI Assistant" },
];

export function NavBar() {
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(paths.home);
  }

  return (
    <nav className="app-nav">
      <NavLink to={paths.home} className="brand">
        NomadIQ
      </NavLink>
      <ul>
        {appLinks.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to}>{item.label}</NavLink>
          </li>
        ))}

        {status === "authenticated" ? (
          <>
            <li className="nav-user">{user?.email}</li>
            <li>
              <button type="button" className="btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to={paths.login}>Login</NavLink>
            </li>
            <li>
              <NavLink to={paths.register}>Register</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
