/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Optimización de imágenes WebP/AVIF
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers de seguridad HTTP + CORS + CSP
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ── HTTPS y transporte ──────────────────────────────────
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // ── Prevención de ataques XSS ───────────────────────────
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // ── Prevención de clickjacking ──────────────────────────
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // ── MIME sniffing ───────────────────────────────────────
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // ── Referrer ───────────────────────────────────────────
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // ── Permisos de hardware ────────────────────────────────
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          // ── DNS prefetch ────────────────────────────────────────
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // ── Content Security Policy ─────────────────────────────
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + reCAPTCHA + Stripe (+ unsafe-eval en dev para Webpack HMR)
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://js.stripe.com https://m.stripe.network",
              // Estilos: self + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fuentes
              "font-src 'self' https://fonts.gstatic.com data:",
              // Imágenes: self + data URIs
              "img-src 'self' data: blob: https:",
              // Conexiones: self + APIs externas + ws para HMR en dev
              isDev
                ? "connect-src 'self' ws://localhost:* http://localhost:*"
                : "connect-src 'self' https://www.google.com/recaptcha/ https://api.stripe.com https://m.stripe.network",
              // iFrames: Stripe
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.google.com/recaptcha/",
              // Workers
              "worker-src 'self' blob:",
              // Media
              "media-src 'self'",
              // Upgrade HTTP solo en producción
              ...(isDev ? [] : ["upgrade-insecure-requests"]),
            ].join('; '),
          },
          // ── Dominios cruzados ───────────────────────────────────
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },
      // Cache estático para assets
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
