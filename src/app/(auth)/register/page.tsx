"use client";

import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter(); 

  interface User {
    name: string;
    email: string;
    password: string;
  }

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string | null, type: 'success' | 'error' | null }>({ text: null, type: null });
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
  });

const handleRegister = async () => {
  try {
    setLoading(true);

    const res = await axios.post("/api/auth/register", user, { withCredentials: true });
    const data = res.data;

    setUser({ name: "", email: "", password: "" });

    if (res.status === 200) {
      setMessage({
        text: data.message || "Registration successful! Redirecting to feed...",
        type: "success",
      });

      setTimeout(() => {
        setMessage({ text: null, type: null });
        router.push("/feed");
      }, 1500);  // Small delay to show success message before redirect
    }
  } catch (err: any) {
    console.error("Signup request failed:", err);

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
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      
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

      {/* Form Card */}
      <div className="bg-zinc-900 rounded-lg w-full max-w-sm p-6 space-y-6 shadow-lg">
        <div className="flex justify-center">
          <span className="text-blue-500 text-2xl font-bold">LinkedIn</span>
        </div>

        <h1 className="text-lg font-semibold text-center">Join LinkedIn</h1>
        <p className="text-center text-sm text-gray-400">Make the most of your professional life</p>

        <div className="space-y-4">
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            type="text"
            placeholder="Full Name"
            className="w-full p-2 rounded bg-zinc-800 text-white outline-none"
          />
          <input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-zinc-800 text-white outline-none"
          />
          <input
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-zinc-800 text-white outline-none"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-medium"
            disabled={loading}
          >
            {loading ? "Loading..." : "Agree & Join"}
          </button>
        </div>

        <p className="text-xs text-center text-gray-500">
          By clicking Agree & Join, you agree to LinkedIn's Terms, Privacy Policy, and Cookie Policy.
        </p>

        <p className="text-sm text-center">
          Already on LinkedIn?{" "}
          <Link href="/login" className="text-blue-500 hover:underline cursor-pointer">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
