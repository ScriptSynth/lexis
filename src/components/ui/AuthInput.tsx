"use client";

import React, { useState } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    isDimmed?: boolean;
}

export function AuthInput({
    label,
    id,
    type = "text",
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    isDimmed = false,
    ...props
}: AuthInputProps) {
    const [internalFocused, setInternalFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;
    const isFocusedOrFilled = internalFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setInternalFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setInternalFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className={`relative transition-opacity duration-500 ${isDimmed ? "opacity-30 blur-[1px]" : "opacity-100"}`}>
            <div className="relative pt-6">
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`
            block w-full border-b bg-transparent py-3 font-mono text-sm text-black
            transition-all duration-300 ease-out
            focus:border-b-2 focus:border-black focus:pl-4 focus:outline-none
            ${error ? "border-b-dashed border-red-500" : "border-gray-200"}
          `}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={`
            absolute left-0 top-0 text-xs font-medium tracking-widest text-gray-500 uppercase transition-all duration-300
            ${isFocusedOrFilled ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
          `}
                >
                    {label}
                </label>
                {/* Placeholder-like label when empty and not focused */}
                <div
                    aria-hidden="true"
                    className={`
            pointer-events-none absolute left-0 top-9 font-mono text-sm text-gray-400 transition-all duration-300
            ${isFocusedOrFilled ? "-translate-y-8 opacity-0" : "translate-y-0 opacity-100"}
          `}
                >
                    {label}
                </div>
            </div>
            {error && (
                <div className="mt-1 font-mono text-[10px] text-red-500 animate-pulse">
                    {error}
                </div>
            )}
        </div>
    );
}
