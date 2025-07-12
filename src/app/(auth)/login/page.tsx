'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { useSocket } from '../../../../context/SocketContext';
import toast from 'react-hot-toast'

export default function LoginPage() {
   const router = useRouter(); 
   const {fetchUser, user} = useAuth();
   const socket = useSocket();

  interface User {
    email: string;
    password: string;
  }

  useEffect(() => {
  if (!socket || !user?.id) return;

  socket.emit('login-user', user.id);
}, [socket, user?.id]);


  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState<User>({
    email: "",
    password: "",
  });
const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await axios.post("/api/auth/login", loginUser, { withCredentials: true });
    const data = res.data;

    if (res.status === 200) {
      toast.success("Login successful! Redirecting to feed...")
    

      setLoginUser({ email: "", password: "" }); 
      fetchUser();
       // Clear form AFTER successful login

      setTimeout(() => {
       
        router.push("/feed");
      }, 1500);
    }
  } catch (err: any) {
    console.error("Login request failed:", err);

    const apiMessage = err?.response?.data?.message;

    toast.error("Something went wrong. Please try again.")

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-lg text-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 outline-none"
            placeholder="you@example.com"
             value={loginUser.email}
            onChange={(e) => setLoginUser({ ...loginUser, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 outline-none"
            placeholder="••••••••"
             value={loginUser.password}
            onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })}
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
