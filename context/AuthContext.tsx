"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

import { logout as logoutApi } from "@/services/authServices";
import { useGetUserLazyQuery } from "@/graphql/user/hooks";
import type { User } from "@/graphql/generated/graphql";

export const AuthProvider = ({
  children,
  hasInitialToken = true,
}: {
  children: ReactNode;
  hasInitialToken?: boolean;
}) => {
  const [user, setUser] = useState<User | null>(null);

  // isInitializing state is used to handle the user state when user click refresh button
  // it will be true when user is loading for the first time
  // and false when user is loaded
  const [isInitializing, setIsInitializing] = useState(true);
  const { getUser, loading, error } = useGetUserLazyQuery();

  // Fetch the user session securely from the backend cookie via GraphQL
  useEffect(() => {
    const fetchUser = async () => {
      // Check if the server detected the HTTP-only cookie.
      // If not, we skip fetching user details immediately.
      if (!hasInitialToken) {
        setUser(null);
        setIsInitializing(false);
        return;
      }

      try {
        const response = await getUser();
        const userData = response?.data?.getUser;
        if (error || !userData) {
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (e) {
        console.error("Failed to fetch user session", e);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchUser();
  }, [hasInitialToken]);

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, isLoading: isInitializing || loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
