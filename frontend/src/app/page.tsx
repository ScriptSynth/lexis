"use client";

import Link from "next/link";
import { ArrowRight, Database, Filter, BookOpen, Layers, Gem } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LexisLogo } from "@/components/LexisLogo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ProductDemo } from "@/components/landing/ProductDemo";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [isInverted, setIsInverted] = useState(false);

  // Scroll Logic for Inversion
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const rect = scrollRef.current.getBoundingClientRect();
        // If the top of the black section touches the middle of the screen (or close to it), invert nav
        // OR better: if we have scrolled past a certain point. 
        // Let's toggle 'isInverted' when the black section dominates.
        const threshold = window.innerHeight * 0.4;
        setIsInverted(rect.top < threshold);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-gray-200 selection:text-black transition-colors duration-1000 ${isInverted ? 'bg-black' : 'bg-white'}`}>

      {/* Navigation Header */}
      <header className={`fixed top-0 w-full z-50 transition-colors duration-500 ${isInverted ? 'text-white' : 'text-black'}`}>
        <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group hover:opacity-70 transition-opacity">
            <LexisLogo size={32} color={isInverted ? "white" : "black"} />
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tighter">Lexis</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${isInverted ? 'border-white/20 text-gray-400' : 'border-black/10 text-gray-500'}`}>V1.0</span>
            </div>
          </Link>

          {!isLoading && (
            <div className={`flex items-center space-x-6 font-mono text-xs tracking-wide ${isInverted ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              {user ? (
                <Link href="/home">
                  <MagneticButton className={`px-6 py-2.5 rounded-full font-bold transition-all border ${isInverted ? 'bg-white text-black border-white hover:bg-gray-200' : 'bg-transparent text-black border-black/10 hover:bg-black hover:text-white'}`}>
                    DASHBOARD
                  </MagneticButton>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hover:underline underline-offset-4 decoration-current opacity-60 hover:opacity-100 transition-opacity hidden md:inline-block">
                    [ SIGN_IN ]
                  </Link>
                  <Link href="/register">
                    <MagneticButton className={`px-6 py-2.5 rounded-full font-bold transition-all border ${isInverted ? 'bg-white text-black border-white hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800 border-black'}`}>
                      Start Reading for Free
                    </MagneticButton>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 1. Technical Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white text-black z-10 pt-32 pb-12 px-6">

        {/* Data Background (Dotted Grid + Vignette) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)]" />
        </div>

        {/* Floating Information Accents (Monospace Metadata) */}
        <div className="absolute top-24 left-8 font-mono text-[10px] text-gray-400 tracking-widest hidden md:block select-none">
          [ SYSTEM: ACTIVE ]
        </div>
        <div className="absolute top-24 right-8 font-mono text-[10px] text-gray-400 tracking-widest hidden md:block select-none text-right">
          [ LAST_SCRAPE: 12m AGO ]<br />
          [ NODE: US_EAST_4 ]
        </div>
        <div className="absolute bottom-8 left-8 font-mono text-[10px] text-gray-400 tracking-widest hidden md:block select-none">
          [ SOURCES_TRACKED: 142 ]
        </div>
        <div className="absolute bottom-8 right-8 font-mono text-[10px] text-gray-400 tracking-widest hidden md:block select-none text-right">
          [ LATENCY: 42ms ]
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Headline */}
          <div className="group cursor-default mb-6 relative">
            <h1 className="text-[13vw] lg:text-[160px] leading-[0.8] font-black tracking-tighter select-none transition-all duration-300 hover:scale-[1.01]">
              <span className="block text-gray-200 md:text-transparent md:bg-clip-text md:bg-gradient-to-b md:from-black/80 md:to-black/20 group-hover:text-black transition-colors duration-700">READ LESS.</span>
              <span className="block text-black drop-shadow-sm">KNOW MORE.</span>
            </h1>
          </div>

          {/* Subheadline Addition */}
          <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            The RSS-driven algorithm that distills global noise into <span className="text-black font-medium">5-line news summaries</span>.
          </p>

          {/* Kinetic Magnetic CTA */}
          <div className="mb-12 relative group">
            {!isLoading && (
              <Link href={user ? "/home" : "/register"}>
                <div className="w-[150px] h-[150px] rounded-full border border-black/5 flex items-center justify-center group-hover:border-black/20 transition-colors duration-500 relative">
                  <MagneticButton className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <ArrowRight size={24} />
                  </MagneticButton>
                  {/* Pulse Ring */}
                  <div className="absolute inset-0 rounded-full border border-black opacity-0 group-hover:animate-ping-slow" />
                </div>
              </Link>
            )}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-gray-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {user ? "[ ENTER_SYSTEM ]" : "[ Start Reading for Free ]"}
            </div>
          </div>

          {/* Visual Anchor: Line & Preview Card */}
          <div className="flex flex-col items-center gap-0 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {/* Glowing Line */}
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

            {/* Preview Floating Card */}
            <div className="mt-0 p-1 rounded-2xl bg-gradient-to-b from-black/5 to-transparent backdrop-blur-[2px]">
              <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-2xl rounded-xl p-4 max-w-[320px] text-left transform hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">TC</div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">TechCrunch</div>
                    <div className="text-[9px] text-gray-400 font-mono">14s AGO</div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full mb-1.5" />
                <div className="h-1.5 w-3/4 bg-gray-100 rounded-full mb-1.5" />
                <div className="h-1.5 w-1/2 bg-gray-100 rounded-full" />
              </div>
            </div>

            <span className="mt-4 font-mono text-[9px] text-gray-400 tracking-widest uppercase">
              Live Preview
            </span>
          </div>

        </div>
      </section>

      {/* 1.5 New Clarity Section */}
      <section className="w-full bg-white text-black py-24 px-6 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">

          {/* How It Works Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-b border-gray-100 pb-24">
            {[
              { icon: Database, label: "01. SCRAPE", title: "Global Ingestion", desc: "We track 10,000+ RSS feeds from trusted publishers every second." },
              { icon: Filter, label: "02. DISTILL", title: "Noise Filtering", desc: "Our engine removes clickbait, ads, and duplicates." },
              { icon: BookOpen, label: "03. READ", title: "Pure Signal", desc: "You get 5-line summaries. Nothing else." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-2 text-gray-400 font-mono text-xs tracking-widest">
                  <step.icon size={14} />
                  {step.label}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Visual Comparison Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            {/* Left: The Noise */}
            <div className="bg-gray-50 p-12 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0" />
              <div className="z-10 text-center">
                <div className="mb-6 mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Layers size={32} className="text-gray-400" />
                </div>
                <h4 className="text-2xl font-bold mb-2 text-gray-400 line-through decoration-red-500/50">The Noise</h4>
                <p className="text-gray-400 text-sm mb-8">Pop-ups, paywalls, 20-min reads.</p>

                {/* Cluttered Mockup */}
                <div className="w-64 space-y-2 opacity-50 blur-[1px] group-hover:blur-none transition-all duration-500 scale-90">
                  <div className="h-4 bg-gray-300 w-full rounded" />
                  <div className="h-24 bg-gray-200 w-full rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">ADVERTISEMENT</div>
                  <div className="h-4 bg-gray-300 w-2/3 rounded" />
                  <div className="h-4 bg-gray-300 w-full rounded" />
                </div>
              </div>
            </div>

            {/* Right: The Lexis Way */}
            <div className="bg-black text-white p-12 flex flex-col items-center justify-center relative">
              <div className="z-10 text-center">
                <div className="mb-6 mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Gem size={32} className="text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Lexis Timeline</h4>
                <p className="text-gray-400 text-sm mb-8">5 Lines. 30 Seconds. Done.</p>

                {/* Clean Mockup */}
                <div className="w-64 bg-white/10 p-4 rounded-xl border border-white/10 text-left shadow-2xl transform hover:scale-105 transition-transform cursor-default">
                  <div className="flex gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="text-[10px] text-gray-400 font-mono">JUST NOW</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/80 w-full rounded-sm" />
                    <div className="h-2 bg-white/60 w-full rounded-sm" />
                    <div className="h-2 bg-white/40 w-2/3 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Inverted Section & Bento Grid */}
      <section ref={scrollRef} className="relative w-full bg-black text-white py-48 px-6 min-h-screen">

        <div className="max-w-[1400px] mx-auto">
          <div className="mb-32 text-center md:text-left">
            <span className="font-mono text-xs text-gray-500 mb-4 block tracking-widest">V 2.0 // MANIFESTO</span>
            <h2 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
              Information has become noise.<br />
              <span className="text-gray-500">We restored the signal.</span>
            </h2>
          </div>

          {/* Ghost Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-48">
            {[
              { title: "Algorithm-Driven Clarity", desc: "Proprietary LexRank™ engine distills thousands of articles into essential intelligence." },
              { title: "Zero-Noise Feed", desc: "No ads. No popups. No clickbait. Just raw, verified information." },
              { title: "Source-First Integrity", desc: "We only index the world's most reputable publishers. You control the mix." }
            ].map((item, i) => (
              <div key={i} className="border border-white/20 p-10 min-h-[300px] flex flex-col justify-between hover:bg-white/5 transition-colors duration-500 group">
                <div className="font-mono text-xs text-gray-500">0{i + 1}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Product Demo */}
          <div className="w-full mb-32">
            <div className="text-center mb-12">
              <span className="font-mono text-xs text-green-500 tracking-widest uppercase">● Live System Demo</span>
            </div>
            <ProductDemo />
          </div>

          {/* Footer CTA */}
          <div className="text-center py-24 border-t border-white/10">
            <h3 className="text-5xl md:text-8xl font-black mb-12 tracking-tight">
              Ready to focus?
            </h3>
            {!isLoading && (
              <Link href={user ? "/home" : "/register"}>
                <MagneticButton className="px-12 py-6 rounded-full text-xl font-bold bg-white text-black hover:scale-105 transition-transform inline-flex items-center">
                  {user ? "Enter Dashboard" : "Get Early Access"}
                  <ArrowRight className="ml-4" />
                </MagneticButton>
              </Link>
            )}
          </div>
        </div>

      </section>

      {/* 4. Clean Footer */}
      <footer className="w-full py-8 bg-black text-center border-t border-white/5">
        <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">
          Lexis © 2026 — Information, Refined.
        </p>
      </footer>

    </div>
  );
}
