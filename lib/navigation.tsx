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
  History,
  UserCircle,
  Library,
  ShieldCheck,
  Heart,
  Star,
  ScrollText,
} from "lucide-react";
import { NavItem } from "@/components/layout/DashboardShell";
import { User_Roles } from "@/graphql/generated/graphql";
import { Maybe } from "graphql/jsutils/Maybe";

export const adminNavItems: NavItem[] = [
  { title: "Platform Overview", href: "/", icon: <Globe /> },
  { title: "Libraries", href: "/libraries", icon: <Building /> },
  { title: "Catalog", href: "/catalog", icon: <Library /> },
  { title: "Users", href: "/users", icon: <Users /> },
  { title: "Roles", href: "/roles", icon: <ShieldCheck /> },
  { title: "Reviews", href: "/reviews", icon: <Star /> },
  { title: "Audit Log", href: "/audit-log", icon: <ScrollText /> },
  { title: "Reports", href: "/reports", icon: <ShieldAlert /> },
  { title: "System Health", href: "/health", icon: <Activity /> },
  { title: "Profile", href: "/profile", icon: <UserCircle /> },
];

export const ownerNavItems: NavItem[] = [
  { title: "Overview", href: "/", icon: <PieChart /> },
  { title: "Inventory", href: "/inventory", icon: <BookOpen /> },
  { title: "Members", href: "/members", icon: <Users /> },
  { title: "Financials", href: "/financials", icon: <IndianRupee /> },
  { title: "Settings", href: "/settings", icon: <Settings /> },
  { title: "Profile", href: "/profile", icon: <UserCircle /> },
];

export const userNavItems: NavItem[] = [
  { title: "Home", href: "/", icon: <Home /> },
  { title: "Browse Books", href: "/books", icon: <BookOpen /> },
  { title: "Saved", href: "/saved", icon: <Heart /> },
  { title: "Order History", href: "/orders", icon: <History /> },
  { title: "Libraries", href: "/libraries", icon: <Building /> },
  { title: "Profile", href: "/profile", icon: <UserCircle /> },
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
