import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                icon: true,
                replaceAttrValues: {
                    '#0D1117': 'currentColor',
                    '#0d1117': 'currentColor',
                    '#000000': 'currentColor',
                    '#000': 'currentColor',
                    black: 'currentColor',
                },
            },
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@@': path.resolve(__dirname, 'src/components'),
            '@@@': path.resolve(__dirname, 'src/features'),
        },
    },
});
