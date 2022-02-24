import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/nope.ts'),
            name: 'Nope',
            formats: ['umd'],
            fileName: (format) => `nope.${format}.js`,
        },
    },
    server: {
        port: 3000,
    },
});
