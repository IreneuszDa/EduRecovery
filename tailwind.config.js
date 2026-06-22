/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
        hairline: "0 1px 0 rgba(15, 23, 42, 0.05)"
      }
    }
  },
  plugins: []
};
