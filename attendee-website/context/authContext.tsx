"use client";

import React, { createContext, useContext } from "react";

type UserRole = "HR" | "EMPLOYEE";

interface AuthContextValue {
  role: UserRole;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TEMP: replace with token decode / API later
  const role: UserRole = "HR";

  return (
    <AuthContext.Provider value={{ role }}>{children}</AuthContext.Provider>
  );
}
