import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['better-sqlite3', 'pdf-parse', 'pdfjs-dist'],
  // Next's file tracer doesn't detect pdfjs's runtime-resolved worker file,
  // so it gets dropped from the standalone build. Ship it explicitly.
  outputFileTracingIncludes: {
    '/api/recipes/import-pdf': ['./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
