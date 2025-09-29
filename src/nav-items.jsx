import { TrendingUp, Star, List } from "lucide-react";
import Index from "./pages/Index.jsx";
import AssetDetails from "./pages/AssetDetails.jsx";
import Favorites from "./pages/Favorites.jsx";
import Items from "./pages/Items.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Star className="h-4 w-4" />,
    page: <Favorites />,
  },
  {
    title: "Items",
    to: "/items",
    icon: <List className="h-4 w-4" />,
    page: <Items />,
  },
];

export const routes = [
  ...navItems,
  {
    to: "/asset/:id",
    page: <AssetDetails />,
  },
];
