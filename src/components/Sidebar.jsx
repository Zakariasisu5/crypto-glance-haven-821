import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User, Zap, Star, List, DollarSign, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: DollarSign, label: 'Lend', path: '/lend' },
    { icon: CreditCard, label: 'Borrow', path: '/borrow' },
    { icon: User, label: 'Credit Profile', path: '/credit' },
    { icon: TrendingUp, label: 'DeFi Insights', path: '/defi' },
    { icon: Zap, label: 'DePIN Finance', path: '/depin' },
    { icon: Star, label: 'Favorites', path: '/favorites' },
    { icon: List, label: 'Items', path: '/items' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold moonfi-glow">MoonFI</h2>
        <p className="text-sm text-muted-foreground">Moonshot Universe</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;