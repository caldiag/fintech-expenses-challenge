const apiOrigin = process.env.API_ORIGIN;

if (!apiOrigin) {
  throw new Error('Set API_ORIGIN to the Nest deployment origin, e.g. https://example.vercel.app');
}

const apiUrl = new URL(apiOrigin);
if (apiUrl.protocol !== 'https:' || apiUrl.pathname !== '/' || apiUrl.search || apiUrl.hash) {
  throw new Error('API_ORIGIN must be an HTTPS origin without a path, query, or fragment');
}

export const config = {
  framework: null,
  buildCommand: 'pnpm --filter @app/types build && pnpm run build',
  outputDirectory: 'build/client',
  rewrites: [
    { source: '/api/:path*', destination: `${apiUrl.origin}/api/:path*` },
    { source: '/:path*', destination: '/index.html' },
  ],
};
