import { NavLink } from 'react-router-dom';
import WalletConnectButton from './WalletConnectButton';
import NotificationButton from './NotificationButton';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
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

          <NavLink to="/dashboard" className="flex items-center space-x-3" aria-label="MoonCreditFi">
            <img
              src="/logo.png"
              alt="MoonCreditFi logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
              aria-hidden={false}
              onError={(e) => { e.currentTarget.src = '/moonfi-logo.svg'; }}
            />
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <NotificationButton />
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
