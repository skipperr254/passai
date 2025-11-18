import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingLogo } from "@/components/ui/Logo";

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Shows loading screen with animated logo while checking authentication status
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen with animated logo while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col items-center justify-center p-4">
        <LoadingLogo size={96} message="Loading PassAI..." />

        {/* Optional: Animated gradient bar */}
        <div className="mt-8 w-64 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-blue-600 to-indigo-600 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return <Outlet />;
}
