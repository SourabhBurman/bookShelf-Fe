// services/authService.ts

import { Gender, User, User_Roles } from "@/graphql/generated/graphql";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Invalid login credentials");
  }

  return response.json();
};

export const signup = async (data: {
  name: string;
  gender: Gender;
  email: string;
  password: string;
  role: User_Roles;
}) => {
  const response = await fetch(`${API_URL}/signup`, {
    // Replace '/auth/me' with your actual profile endpoint
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // CRITICAL. This forces the browser to send your cookie to the backend!
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Not logged in");
  }

  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return response.json();
};
