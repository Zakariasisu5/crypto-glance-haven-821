import { NavLink } from 'react-router-dom';
import WalletConnect from './WalletConnect';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-bold creditcoin-glow">Creditcoin</span>
        </NavLink>
        <WalletConnect />
      </div>
    </nav>
  );
};

export default Navbar;
