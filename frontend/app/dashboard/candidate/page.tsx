'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'candidate') {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Candidate Dashboard</h1>
        <p className="mb-6 text-gray-700">Welcome, Candidate! 🎯</p>
        {/* Add candidate-specific components here */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
