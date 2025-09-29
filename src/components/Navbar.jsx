import { NavLink } from 'react-router-dom';
import { navItems } from '@/nav-items';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold terminal-glow">CryptoHack</NavLink>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-1 ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'}`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
