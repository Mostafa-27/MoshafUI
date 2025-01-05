module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "traditional-arabic": ["traditional-arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
  important: true, // This ensures Tailwind classes override Material UI styles
};
