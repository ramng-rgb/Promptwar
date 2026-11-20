/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: "#10b981",
          moderate: "#f59e0b",
          unhealthySensitive: "#f97316",
          unhealthy: "#ef4444",
          veryUnhealthy: "#8b5cf6",
          hazardous: "#7f1d1d",
          severe: "#450a0a"
        }
      }
    },
  },
  plugins: [],
}
