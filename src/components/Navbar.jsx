import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import WalletConnectButton from './WalletConnectButton';

const Navbar = () => {
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
        <NavLink to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-xl font-bold moonfi-glow">MoonFI</span>
        </NavLink>
        <div className="flex items-center gap-4">
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
