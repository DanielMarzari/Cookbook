import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ['better-sqlite3', 'pdf-parse', 'pdfjs-dist'],
  // Next's file tracer doesn't detect pdfjs's runtime-resolved worker file,
  // so it gets dropped from the standalone build. Ship it explicitly.
  outputFileTracingIncludes: {
    '/api/recipes/import-pdf': ['./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'],
  },
  images: {
    // Serve original images directly instead of running them through the
    // server-side sharp optimizer. On the free-tier box this avoids the memory
    // spike of optimizing arbitrary remote images (and disables the
    // /_next/image proxy endpoint), while still getting next/image's lazy
    // loading and layout-shift prevention.
    unoptimized: true,
  },
};

export default nextConfig;
