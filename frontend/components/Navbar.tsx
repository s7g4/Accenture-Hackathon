"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">AI Recruit</h1>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {user?.role === "candidate" && (
          <Link href="/candidate" className="hover:underline">
            Dashboard
          </Link>
        )}
        {user?.role === "recruiter" && (
          <Link href="/recruiter" className="hover:underline">
            Dashboard
          </Link>
        )}
        {user ? (
          <button onClick={logout} className="ml-4 underline hover:text-gray-300">
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
