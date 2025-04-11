"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
