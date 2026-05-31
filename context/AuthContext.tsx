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

export type User = {
  id?: string;
  name?: string;
  email?: string;
  role: {
    type: "admin" | "owner" | "user";
  };
};

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

import { GET_USER } from "@/graphql/user";
import { logout as logoutApi } from "@/services/authServices";
import { useLazyQuery } from "@apollo/client/react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [getUser, { loading, error }] = useLazyQuery(GET_USER);

  // Fetch the user session securely from the backend cookie via GraphQL
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();

        if (error || response?.data) {
          setUser(null);
        } else {
          setUser(response?.data?.getUser);
        }
      } catch (e) {
        console.error("Failed to fetch user session", e);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading: loading }}>
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
