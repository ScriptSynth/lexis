"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LexisLogo } from "@/components/LexisLogo";
import { AuthInput } from "@/components/ui/AuthInput";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/home");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,#ffffff_0%,#f9fafb_100%)] px-6">
            <div className={`w-full max-w-sm transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

                {/* Header */}
                <div className="flex flex-col items-center mb-16 space-y-6">
                    <Link href="/">
                        <LexisLogo size={42} />
                    </Link>
                    <h1 className="text-xl font-bold tracking-[-0.05em] uppercase">
                        Welcome Back
                    </h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-12">
                    <div className="space-y-4">
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
                            {loading ? "Authenticating..." : "Enter Dashboard"}
                        </button>

                        <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                            <Link href="/forgot-password" className="hover:text-black transition-colors">
                                [ FORGOT_PASSWORD ]
                            </Link>
                            <Link href="/register" className="hover:text-black transition-colors">
                                [ CREATE_ACCOUNT ]
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
