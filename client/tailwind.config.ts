import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      lg: { max: "1440px" },
      tb: { max: "1000px" },
      md: { max: "768px" },
      sm: { max: "500px" },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        rotating: {
          "0%, 100%": { transform: "rotate(360deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInSlow: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        type: {
          "0%, 100%": {
            transform: "translateY(-50%)",
          },
          "50%": { transform: "translateY(0%)" },
        },
        slide: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        stretch: {
          "0%": { height: "0%" },
          "100%": { height: "100%" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-50%)" },
          "80%": { opacity: "0.5" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { opacity: "1", transform: "translateX(0%)" },
          "40%": { opacity: "0.5" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-70%)" },
          "60%": { opacity: "0.5" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
        lightning: {
          "0%": {
            top: "0px",
          },
          "40%": {
            top: "15px",
          },
          "60%": {
            top: "16px",
          },
          "100%": {
            top: "36px",
          },
        },
        lightningStrike: {
          "0%": {
            opacity: "40%",
          },
          "40%": {
            opacity: "100%",
          },
          "60%": {
            opacity: "60%",
          },
          "100%": {
            opacity: "100%",
          },
        },
        textReveal: {
          "0%": { transform: "translate(0, 100%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        glassIn: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(90deg)",
          },
        },
        glassOut: {
          "0%": {
            transform: "rotate(90deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
        analyzing: {
          "0%": { color: "#ffffff" },
          "50%": { color: "#e3e3e3" },
          "100%": { color: "#ffffff" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "gradient-x": {
          "0%, 100%": {
            opacity: "0.5",
          },
          "50%": {
            opacity: "0.65",
          },
        },
        shimmerDown: {
          "0%": { backgroundPosition: "0 -100%" },
          "100%": { backgroundPosition: "0 200%" },
        },
      },
      animation: {
        "ping-once": "ping 5s cubic-bezier(0, 0, 0.2, 1)",
        rotating: "rotating 30s linear infinite",
        "spin-1.5": "spin 1.5s linear infinite",
        "spin-2": "spin 2s linear infinite",
        "spin-3": "spin 3s linear infinite",
        flip: "flip 1s linear",
        fade: "fadeIn 0.5s ease-in-out",
        "fade-in-slow": "fadeInSlow 1s ease-out forwards",
        fadeOut: "fadeOut 0.3s ease-in-out",
        typing: "type 1s infinite",
        sliding: "slide 0.75s linear",
        stretch: "stretch 0.75s linear",
        slideIn: "slideIn 0.5s ease-in-out",
        slideOut: "slideOut 0.5s ease-in-out",
        slideDown: "slideDown 0.5s ease-in-out",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        lightning: "lightning 0.75s ease-in-out",
        lightningStrike: "lightningStrike 0.75s ease-in-out",
        textReveal: "textReveal 1s cubic-bezier(0.77, 0, 0.175, 1) 0.4s",
        glassIn: "glassIn 0.3s linear",
        glassOut: "glassOut 0.3s linear",
        analyzing: "analyzing 1.5s linear infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        scan: "scan 2s linear infinite",
        gradient: "gradient 8s linear infinite",
        "gradient-shift": "gradient-x 2s ease infinite",
        shimmerDown: "shimmerDown 2s infinite linear",
      },
    },
  },
  plugins: [],
} satisfies Config;
