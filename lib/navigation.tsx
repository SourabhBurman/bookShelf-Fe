import {
  Globe,
  Building,
  Users,
  ShieldAlert,
  Activity,
  PieChart,
  BookOpen,
  IndianRupee,
  Settings,
  Home,
  Clock,
  Heart,
  Library,
  History,
} from "lucide-react";
import { NavItem } from "@/components/layout/DashboardShell";
import { User_Roles } from "@/graphql/generated/graphql";
import { Maybe } from "graphql/jsutils/Maybe";

export const adminNavItems: NavItem[] = [
  { title: "Platform Overview", href: "/dashboard", icon: <Globe /> },
  { title: "Libraries", href: "/libraries", icon: <Building /> },
  { title: "Users", href: "/users", icon: <Users /> },
  { title: "Reports", href: "/reports", icon: <ShieldAlert /> },
  { title: "System Health", href: "/health", icon: <Activity /> },
];

export const ownerNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: <PieChart /> },
  { title: "Inventory", href: "/inventory", icon: <BookOpen /> },
  { title: "Members", href: "/members", icon: <Users /> },
  { title: "Financials", href: "/financials", icon: <IndianRupee /> },
  { title: "Settings", href: "/settings", icon: <Settings /> },
];

export const userNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: <Home /> },
  { title: "My Rentals", href: "/orders", icon: <Clock /> },
  { title: "Saved Books", href: "/saved", icon: <Heart /> },
  { title: "Nearby Libraries", href: "/libraries", icon: <Library /> },
  { title: "Order History", href: "/orders", icon: <History /> },
];

export const getNavItemsByRole = (
  role: Maybe<User_Roles> | undefined,
): NavItem[] => {
  switch (role) {
    case User_Roles.Admin:
      return adminNavItems;
    case User_Roles.LibraryOwner:
      return ownerNavItems;
    default:
      return userNavItems;
  }
};
