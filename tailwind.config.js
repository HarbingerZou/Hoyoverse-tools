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
  //This prevents the webpack to remove unused color and background image
  safelist: [
    {
      pattern: /bg-star-/,
      variants: ['hover', 'focus'], // Add any variants you might use
    },
    {
      pattern: /text-star-/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /border-star-/,
      variants: ['hover', 'focus'],
    },
  ],
  theme: {
    screens: {
      'sm': '375px', // iPhone XS and similar
      'md': '640px', // iPhone Plus and similar
      // Add more custom breakpoints as needed
    },
    extend: {
      backgroundImage: {
        'star-5': 'linear-gradient(to right, rgb(190, 122, 55), rgb(183, 165, 48))',
        'star-4': 'linear-gradient(to right, rgb(76, 62, 96), rgb(182, 114, 202))',
        'star-3': 'linear-gradient(to right, rgb(62, 78, 96), rgb(114, 117, 202))',
        'star-2': 'linear-gradient(to right, rgb(62, 95, 96), rgb(114, 181, 202))',
      },
      colors: {
        // Define your custom colors
        primary: '#0c0e1b', // Example primary color (purple)
        secondary: '#34353a',
        silver: "#c0c0c0",
        test: "#aaaaaa",
        'star-5': '#be7a37',
        'star-4': '#4c3e60',
        'star-3': '#3e4e60',
        'star-2': '#3e5f60',
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
    themes: ["black"], // Example theme customization
  },
}
