// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css',
        'modern-normalize/modern-normalize.css',
        '@fortawesome/fontawesome-free/css/all.css'
],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui'
  ],
  
  app: {
    head: {
      title: 'Новое Радио',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1'},
        { charset: 'utf-8' }],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap' }
      ]
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],  
    server: {
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'api.newradio.md',
      },
    allowedHosts: ['api.newradio.md']
    },

    optimizeDeps: {
      include: ['hls.js']
    }
  }
})
