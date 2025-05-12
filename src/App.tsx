import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/home";
import routes from "tempo-routes";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Lazy load pages for better performance
const PropertyListingPage = lazy(() => import("./pages/listing/[id]"));
const PortfolioPage = lazy(() => import("./pages/portfolio/[userId]"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const SignUpPage = lazy(() => import("./pages/auth/signup"));
const CreateListingPage = lazy(() => import("./pages/create-listing"));
const EditListingPage = lazy(() => import("./pages/edit-listing"));

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          {/* Tempo routes need to be rendered before the application routes */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/listing/:id" element={<PropertyListingPage />} />
            <Route
              path="/portfolio/:userId"
              element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-listing"
              element={
                <ProtectedRoute>
                  <CreateListingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-listing/:id"
              element={
                <ProtectedRoute>
                  <EditListingPage />
                </ProtectedRoute>
              }
            />
            {/* Allow Tempo to capture routes before any catch-all */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={<></>} />
            )}
          </Routes>

          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
