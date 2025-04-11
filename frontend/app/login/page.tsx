'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {FaEnvelope, FaLock} from 'react-icons/fa';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/login', {
                email,
                password,
            });

            const token = res.data.access_token;
            const role = res.data.role;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirect based on role
            if (role === 'candidate') {
                router.push('/dashboard/candidate');
            } else if (role === 'recruiter') {
                router.push('/dashboard/recruiter');
            }
        } catch (err) {
            alert('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header with logo */}
            <header className="bg-white shadow-sm p-4">
                <div className="container mx-auto">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">JF</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">Job Finder</span>
                    </Link>
                </div>
            </header>

            {/* Login form */}
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-3xl">JF</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Welcome Back</h1>
                    <p className="text-center text-gray-600 mb-6">Sign in to continue to Job Finder</p>

                    <div className="mb-4 relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                            <FaEnvelope/>
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6 relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                            <FaLock/>
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 py-4 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Job Finder. All rights reserved.
                </div>
            </footer>
        </div>
    );
}