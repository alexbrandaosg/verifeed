
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Login from "./pages/Login";
import AgencyDashboard from "./pages/AgencyDashboard";
import ClientReview from "./pages/ClientReview";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => {
  console.log('=== APP DEBUG ===');
  console.log('App renderizando - URL atual:', window.location.href);
  console.log('App renderizando - pathname:', window.location.pathname);
  console.log('App renderizando - search:', window.location.search);
  console.log('App renderizando - hash:', window.location.hash);
  console.log('=== FIM APP DEBUG ===');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                } />
                <Route path="/" element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <AgencyDashboard />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/agency" element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <AgencyDashboard />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/review/:campaignId" element={
                  <ErrorBoundary>
                    <ClientReview />
                  </ErrorBoundary>
                } />
                <Route path="*" element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                } />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
