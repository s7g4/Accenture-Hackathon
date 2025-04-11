"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function useTokenExpiry() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: { exp: number } = jwtDecode(token);
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
