/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,tsx,mdx}',
        './pages/**/*.{js,ts,tsx,mdx}',
        './components/**/*.{js,ts,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,tsx,mdx}',
    ],

    theme: {
        extend: {
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
        },
    },
    plugins: [],
};
