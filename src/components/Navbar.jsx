import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import WalletConnectButton from './WalletConnectButton';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, session } = useSupabaseAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* hamburger - visible on mobile only */}
          <button
            aria-label="Toggle menu"
            className="mr-2 md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => onToggleSidebar && onToggleSidebar()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <NavLink to="/" className="flex items-center space-x-3">
            <img
              src="/moonfi-logo.svg"
              alt="moonFi logo"
              className="w-8 h-8 rounded-md object-cover"
              aria-hidden={false}
            />
            <span className="text-xl font-bold moonfi-glow">MoonFI</span>
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <WalletConnectButton />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
