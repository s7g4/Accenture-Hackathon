// app/login/page.tsx

'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
            const decoded: { role: string } = jwtDecode(token);

            if (decoded.role === "candidate") {
                router.push("/candidate");
            } else if (decoded.role === "recruiter") {
                router.push("/recruiter");
            }
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
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    );
}
