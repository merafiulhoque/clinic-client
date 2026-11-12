// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    // ...your existing config
    theme: {
        extend: {
            keyframes: {
                "fade-slide-up": {
                    "0%":   { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                // tailwind.config.ts → theme.extend.keyframes
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up": {
                    "0%": { opacity: "0", transform: "translateY(100%)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-slide-up": "fade-slide-up 0.6s ease-out both",
                // tailwind.config.ts → theme.extend.animation
                "fade-in": "fade-in 0.2s ease-out both",
                "slide-up": "slide-up 0.25s ease-out both",
            },
        },
    },

    
};

export default config;