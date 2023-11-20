import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        red: "#e13205",
        darkRed: "#9b0600",
        black: "#353535",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
