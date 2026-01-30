/**
 * Next.js Configuration
 *
 * PERFORMANCE NOTES:
 * - Current bundle size: 107 KB (dashboard) - DO NOT EXCEED 150 KB!
 * - Run `ANALYZE=true pnpm build` to analyze bundle after changes
 * - See /frontend/PERFORMANCE.md for detailed guidelines
 *
 * WARNINGS:
 * ⚠️ DO NOT add custom webpack splitChunks config - it breaks Next.js optimizations
 * ⚠️ DO NOT add optimizePackageImports for removed packages (recharts, lucide-react, framer-motion)
 * ⚠️ DO NOT disable image optimization (unoptimized: true)
 * ⚠️ DO NOT add heavy dependencies without approval (see docs/DEPENDENCIES.md)
 */

const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, ".."),

  // Image optimization - ENABLED for production performance
  // DO NOT disable (unoptimized: true) - costs ~50KB per image
  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Production optimizations
  compiler: {
    // Remove console.* calls in production (except errors/warnings)
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Security & performance headers
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // CSS optimization - reduces CSS bundle size
    optimizeCss: true,
  },

  // DO NOT ADD CUSTOM WEBPACK CONFIG!
  // We tried custom splitChunks and it broke chunk loading.
  // Next.js default optimization is better (achieved 107 KB bundle).
  // See plan file for details: ~/.claude/plans/composed-hopping-book.md
};

module.exports = withBundleAnalyzer(nextConfig);
