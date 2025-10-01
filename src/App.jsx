import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import { WalletProvider } from "./contexts/WalletContext";
import { routes } from "./nav-items";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SupabaseAuthProvider>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-background">
                      {/* overlay for mobile when sidebar is open */}
                      {sidebarOpen && (
                        <div
                          className="fixed inset-0 bg-black/40 z-40 md:hidden"
                          onClick={() => setSidebarOpen(false)}
                          aria-hidden="true"
                        />
                      )}

                      <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
                      <div className="flex">
                        <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                        <main className="flex-1 p-8">
                          <Routes>
                            {routes.map(({ to, page: Page }) => (
                              <Route key={to} path={to} element={<Page />} />
                            ))}
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </WalletProvider>
    </SupabaseAuthProvider>
  );
};

export default App;
