import React from "react";

interface LexisLogoProps {
    className?: string;
    size?: number; // Size in px
    color?: string;
}

export const LexisLogo: React.FC<LexisLogoProps> = ({ className, size = 32, color = "black" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Lexis Logo"
            role="img"
        >
            {/* Outer Circle (Double stroke effect created by stroke width or two circles) 
                Prompt image shows a thick circle or ring. 
                Let's do a thick stroke circle.
            */}
            <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="8" />

            {/* The 'L' */}
            <text
                x="50"
                y="52"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="900"
                fontSize="60"
                fill={color}
                style={{ userSelect: 'none' }}
            >
                L
            </text>
        </svg>
    );
};
