import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar";

// Minimal application shell used to verify routing works end to end.
// Feature-specific layouts can be introduced later without touching this one.
export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavBar />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
