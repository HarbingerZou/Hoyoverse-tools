/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors
        primary: '#0c0e1b', // Example primary color (purple)
        secondary: '#34353a',
        'default-font': "#c0c0c0",
      },
      // Optionally extend the backgroundColor to directly include your primary and secondary colors
      backgroundColor: theme => ({
        ...theme('colors'),
        primary: '#0c0e1b', // Example primary color (purple)
        secondary: '#34353a' // Use the same color value as in colors
      }),
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // Example theme customization
  },
}
