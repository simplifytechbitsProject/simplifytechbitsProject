import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CodeTools from "./pages/CodeTools";
import AIAssistant from "./pages/AIAssistant";
import CodeEditor from "./pages/CodeEditor";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import Collaboration from "./pages/Collaboration";
import Profile from "./pages/Profile";
import Optimization from "./pages/Optimization";
import Automation from "./pages/Automation";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("devai_authenticated");
    const userData = localStorage.getItem("devai_user");
    
    if (authStatus === "true" && userData) {
      try {
        const user = JSON.parse(userData);
        // You can add additional validation here (e.g., token expiry)
      setIsAuthenticated(true);
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem("devai_authenticated");
        localStorage.removeItem("devai_user");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (credentials: { email: string; password: string }) => {
    localStorage.setItem("devai_authenticated", "true");
    localStorage.setItem("devai_user", JSON.stringify(credentials));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("devai_authenticated");
    localStorage.removeItem("devai_user");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1D1616] flex items-center justify-center">
        <div className="text-[#EEEEEE] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/code-tools"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <CodeTools />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/optimization"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Optimization />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/optimization/refactoring"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Optimization />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/optimization/performance"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Optimization />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/optimization/minifier"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Optimization />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/optimization/complexity"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Optimization />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/automation"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/automation/workflow"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/automation/deployment"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/automation/cloud-deploy"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <AIAssistant />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/editor"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <CodeEditor />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/analytics"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/security"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Security />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/collaboration"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Collaboration />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/notifications"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Layout onLogout={handleLogout}>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
