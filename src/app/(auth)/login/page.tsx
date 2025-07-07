'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';

export default function LoginPage() {
   const router = useRouter(); 
   const {fetchUser} = useAuth();

  interface User {
    email: string;
    password: string;
  }

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string | null, type: 'success' | 'error' | null }>({ text: null, type: null });
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await axios.post("/api/auth/login", user, { withCredentials: true });
    const data = res.data;

    if (res.status === 200) {
      setMessage({
        text: data.message || "Login successful! Redirecting to feed...",
        type: "success",
      });

      setUser({ email: "", password: "" }); 
      fetchUser();
       // Clear form AFTER successful login

      setTimeout(() => {
        setMessage({ text: null, type: null });
        router.push("/feed");
      }, 1500);
    }
  } catch (err: any) {
    console.error("Login request failed:", err);

    const apiMessage = err?.response?.data?.message;

    setMessage({
      text: apiMessage || "Something went wrong. Please try again.",
      type: "error",
    });

    setTimeout(() => {
      setMessage({ text: null, type: null });
    }, 5000);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
       {/* Message Banner */}
      {message.text && (
        <div
          className={`fixed top-0 left-0 w-full text-white text-center py-3 z-50 shadow-md ${
            message.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-lg text-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 outline-none"
            placeholder="you@example.com"
             value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 outline-none"
            placeholder="••••••••"
             value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          onClick={handleLogin}
        >
           {loading ? 'loading...' : 'Login'}
        </button>

        <p className="text-center text-sm mt-4 text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:underline"> Register</Link>
        </p>
      </div>
    </div>
  );
}
