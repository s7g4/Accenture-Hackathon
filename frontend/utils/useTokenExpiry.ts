"use client";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

export default function useTokenExpiry() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: { exp: number } = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        router.push("/login");
      }

      const remainingTime = (decoded.exp - currentTime) * 1000;
      const timeout = setTimeout(() => {
        localStorage.removeItem("token");
        router.push("/login");
      }, remainingTime);

      return () => clearTimeout(timeout);
    } catch (e) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);
}
