'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";


export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
  try {
    // 1. Register the user
    await axios.post("http://localhost:8000/register", form);

    // 2. Auto-login after registration
    const res = await axios.post("http://localhost:8000/login", {
      email: form.email,
      password: form.password,
    });

    // 3. Save JWT
    const token = res.data.access_token;
    localStorage.setItem("token", token);

    // 4. Decode token to get role
    const decoded: { role: string } = jwtDecode(token);

    // 5. Redirect based on role
    if (decoded.role === "candidate") {
      router.push("/candidate");
    } else if (decoded.role === "recruiter") {
      router.push("/recruiter");
    } else {
      alert("Unknown role");
    }
  } catch (err) {
    console.error(err);
    alert("Error registering user.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
        >
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
