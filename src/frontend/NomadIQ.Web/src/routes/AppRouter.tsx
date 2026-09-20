import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { RedirectIfAuthenticated } from "../features/auth/components/RedirectIfAuthenticated";
import { AssistantPage } from "../features/assistant/pages/AssistantPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { DestinationDetailsPage } from "../features/discovery/pages/DestinationDetailsPage";
import { DiscoveryPage } from "../features/discovery/pages/DiscoveryPage";
import { PlannerPage } from "../features/planner/pages/PlannerPage";
import { NewTripPage } from "../features/trips/pages/NewTripPage";
import { TripDetailsPage } from "../features/trips/pages/TripDetailsPage";
import { TripsPage } from "../features/trips/pages/TripsPage";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { paths } from "./paths";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={paths.home} element={<HomePage />} />

        <Route
          path={paths.login}
          element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path={paths.register}
          element={
            <RedirectIfAuthenticated>
              <RegisterPage />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path={paths.dashboard}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.trips}
          element={
            <ProtectedRoute>
              <TripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.newTrip}
          element={
            <ProtectedRoute>
              <NewTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.tripDetailsPattern}
          element={
            <ProtectedRoute>
              <TripDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.discovery}
          element={
            <ProtectedRoute>
              <DiscoveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.destinationDetailsPattern}
          element={
            <ProtectedRoute>
              <DestinationDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.planner}
          element={
            <ProtectedRoute>
              <PlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.assistant}
          element={
            <ProtectedRoute>
              <AssistantPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
