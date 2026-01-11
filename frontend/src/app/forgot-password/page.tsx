"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import Link from "next/link";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.com",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
                <div className="max-w-md text-center space-y-4">
                    <h2 className="text-2xl font-bold text-black">Check your email</h2>
                    <p className="text-gray-500">
                        We've sent a password reset link to <span className="font-semibold">{email}</span>.
                    </p>
                    <Link href="/login" className="inline-block mt-4 text-black font-semibold hover:underline">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-black">
                        Reset password
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your email to receive instructions
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleReset}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="relative block w-full rounded-none border border-gray-200 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-2 border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
                        >
                            {loading ? "Send Reset Link" : "Send Reset Link"}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/login" className="font-semibold text-black hover:underline">
                            Back to Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
