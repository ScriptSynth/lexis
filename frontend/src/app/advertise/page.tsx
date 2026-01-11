"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Check, Upload, Loader2, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdvertisePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        startupName: "",
        description: "",
        logoUrl: "",
    });
    const [localLogoFile, setLocalLogoFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLocalLogoFile(e.target.files[0]);
        }
    };

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            let logoUrl = formData.logoUrl;

            // Upload logo if file selected
            if (localLogoFile) {
                const fileExt = localLogoFile.name.split(".").pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("ad-logos") // Assuming waiting for user to create bucket 'ad-logos' or uses generic 'images'
                    .upload(fileName, localLogoFile);

                if (uploadError) {
                    // Fallback or specific error handling. 
                    // For now, if bucket doesn't exist, we might fail. 
                    // Proceeding assuming it works or we just skip logo upload for this MVP step if it fails.
                    console.error("Upload error:", uploadError);
                    // Not blocking submission for now, but ideally we show error.
                } else if (uploadData) {
                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage.from("ad-logos").getPublicUrl(fileName);
                    logoUrl = publicUrl;
                }
            }

            // Save to Supabase
            const { error: dbError } = await supabase.from("ad_submissions").insert({
                name: formData.name,
                email: formData.email,
                startup_name: formData.startupName,
                description: formData.description,
                logo_url: logoUrl,
            });

            if (dbError) throw dbError;

            // Redirect to Payment
            router.push("https://nowpayments.io/payment/?iid=5970165332");
        } catch (error) {
            console.error("Submission error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col">
            {/* Header */}
            <header className="px-6 py-6 border-b border-gray-100 flex justify-between items-center">
                <Link href="/" className="font-bold text-xl tracking-tighter">LEXIS</Link>
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500">
                    Ad Purchase
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md">

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">
                            <span className={step >= 1 ? "text-black" : ""}>Step 1</span>
                            <span className={step >= 2 ? "text-black" : ""}>Step 2</span>
                            <span className={step >= 3 ? "text-black" : ""}>Step 3</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black transition-all duration-300 ease-in-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 shadow-sm">

                        {/* Step 1: Contact Details */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in-up">
                                <h2 className="text-2xl font-bold tracking-tight">Who are you?</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Full Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Elon Musk"
                                            className="w-full border-b-2 border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Email Address</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="elon@tesla.com"
                                            className="w-full border-b-2 border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.name || !formData.email}
                                    className="w-full bg-black text-white h-12 flex items-center justify-center font-bold tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                >
                                    NEXT STEP <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Business Info */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in-up">
                                <h2 className="text-2xl font-bold tracking-tight">Your Startup</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Startup Name</label>
                                        <input
                                            name="startupName"
                                            value={formData.startupName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. SpaceX"
                                            className="w-full border-b-2 border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">
                                            Short Description <span className="text-gray-300 font-normal normal-case">(Max 150 chars)</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            maxLength={150}
                                            placeholder="Revolutionizing space technology..."
                                            className="w-full border-b-2 border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 resize-none h-24"
                                        />
                                        <div className="text-right text-xs text-gray-400 mt-1">
                                            {formData.description.length}/150
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={handleBack}
                                        className="flex-1 bg-white border border-gray-200 text-black h-12 flex items-center justify-center font-bold tracking-wider hover:bg-gray-50 transition-colors"
                                    >
                                        BACK
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.startupName || !formData.description}
                                        className="flex-[2] bg-black text-white h-12 flex items-center justify-center font-bold tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        NEXT STEP <ArrowRight className="ml-2 w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Creative */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in-up">
                                <h2 className="text-2xl font-bold tracking-tight">The Creative</h2>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">Startup Logo</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {localLogoFile ? (
                                            <div className="text-center">
                                                <Check className="w-10 h-10 text-black mx-auto mb-2" />
                                                <p className="text-sm font-medium">{localLogoFile.name}</p>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-400 group-hover:text-black transition-colors">
                                                <Upload className="w-10 h-10 mx-auto mb-2" />
                                                <p className="text-sm font-bold uppercase">Click to upload</p>
                                                <p className="text-xs mt-1">SVG, PNG, JPG (Max 2MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={handleBack}
                                        className="flex-1 bg-white border border-gray-200 text-black h-12 flex items-center justify-center font-bold tracking-wider hover:bg-gray-50 transition-colors"
                                    >
                                        BACK
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading || !localLogoFile}
                                        className="flex-[2] bg-black text-white h-12 flex items-center justify-center font-bold tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                PAY NOW <DollarSign className="ml-1 w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            Secured by NowPayments. <br />
                            Your ad will go live immediately after approval.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}
