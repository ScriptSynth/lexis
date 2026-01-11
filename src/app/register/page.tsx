"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LexisLogo } from "@/components/LexisLogo";
import { AuthInput } from "@/components/ui/AuthInput";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.com",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
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
                <div className="max-w-md text-center space-y-8 animate-fade-in-up">
                    <LexisLogo size={64} className="mx-auto" />
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-mono tracking-tight text-black uppercase">Verify Access</h2>
                        <p className="text-gray-500">
                            Secure link sent to <span className="font-semibold text-black border-b border-black">{email}</span>.
                        </p>
                    </div>
                    <Link href="/login" className="inline-block px-8 py-3 bg-gray-100 text-xs font-mono tracking-widest hover:bg-black hover:text-white transition-colors uppercase">
                        Return to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,#ffffff_0%,#f9fafb_100%)] px-6">
            <div className={`w-full max-w-sm transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

                {/* Header */}
                <div className="flex flex-col items-center mb-16 space-y-6">
                    <Link href="/">
                        <LexisLogo size={42} />
                    </Link>
                    <h1 className="text-xl font-bold tracking-[-0.05em] uppercase">
                        Create Account
                    </h1>
                </div>

                <form onSubmit={handleRegister} className="space-y-12">
                    <div className="space-y-4">
                        <AuthInput
                            id="name"
                            label="Full Name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            isDimmed={focusedField !== null && focusedField !== "name"}
                            required
                        />
                        <AuthInput
                            id="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            isDimmed={focusedField !== null && focusedField !== "email"}
                            required
                        />
                        <AuthInput
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                            isDimmed={focusedField !== null && focusedField !== "password"}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="font-mono text-[10px] text-red-500 text-center tracking-widest uppercase border-b border-dashed border-red-500 pb-2">
                            [ ERROR: {error} ]
                        </div>
                    )}

                    <div className="pt-4 space-y-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-[4px] font-semibold tracking-[0.05em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {loading ? "INITIALIZING..." : "START READING"}
                        </button>

                        <div className="text-center text-xs font-mono text-gray-400">
                            <Link href="/login" className="hover:text-black transition-colors">
                                [ RETURN_TO_LOGIN ]
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
