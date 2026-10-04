import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    // GitHub Pages sirve el sitio en /sin-remordimiento/, no en la raíz.
    // Con dominio propio esto vuelve a '/'.
    base: '/sin-remordimiento/',
    plugins: [tailwindcss()],
})
