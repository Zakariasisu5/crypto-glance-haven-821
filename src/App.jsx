import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import { WalletProvider } from "./contexts/WalletContext";
import { routes } from "./nav-items";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <SupabaseAuthProvider>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-background">
                      <Navbar />
                      <div className="flex">
                        <Sidebar />
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
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </SupabaseAuthProvider>
);

export default App;
