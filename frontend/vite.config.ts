import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 4000,
        allowedHosts: true,
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            plugins: [
                cleanup({
                    comments: 'none',
                }),
            ],
        },
    },
});
