import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Personnel Colors
                'admin-blue': '#1E3A8A',
                // Citizen Colors
                'citizen-green': '#059669',
                // Shared Colors
                'accent-emerald': '#10B981',
                'neutral-bg': '#F9FAFB',
            },
        },
    },

    plugins: [forms],
};
