import { Home, TrendingUp, User, Zap, Star, List } from "lucide-react";
import Index from "./pages/Index.jsx";
import AssetDetails from "./pages/AssetDetails.jsx";
import Favorites from "./pages/Favorites.jsx";
import Items from "./pages/Items.jsx";
import DeFiInsights from "./pages/DeFiInsights.jsx";
import CreditProfile from "./pages/CreditProfile.jsx";
import DePINFinance from "./pages/DePINFinance.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <Home className="h-4 w-4" />,
    page: Index,
  },
  {
    title: "DeFi Insights",
    to: "/defi",
    icon: <TrendingUp className="h-4 w-4" />,
    page: DeFiInsights,
  },
  {
    title: "Credit Profile",
    to: "/credit",
    icon: <User className="h-4 w-4" />,
    page: CreditProfile,
  },
  {
    title: "DePIN Finance",
    to: "/depin",
    icon: <Zap className="h-4 w-4" />,
    page: DePINFinance,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Star className="h-4 w-4" />,
    page: Favorites,
  },
  {
    title: "Items",
    to: "/items",
    icon: <List className="h-4 w-4" />,
    page: Items,
  },
];

export const routes = [
  ...navItems,
  {
    to: "/asset/:id",
    page: AssetDetails,
  },
];
