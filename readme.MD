# Fintech expenses challenge

## Local development

Install dependencies with `pnpm install`, configure the Nest server environment
using `packages/nest-server/.env.TEMPLATE`, and run `pnpm dev` from the repository
root. The React development server proxies `/api` to `http://localhost:3000`.
Set `API_PROXY_TARGET` when the Nest server is available at a different address.

## Vercel deployment

Import the repository twice as two Vercel projects in the same team:

1. Select `packages/nest-server` as the backend project root and the NestJS
   framework. Configure `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`,
   `DATABASE_PASSWORD`, `DATABASE_NAME`, and `JWT_SECRET` for each environment.
   Set `DATABASE_SSL=true` when the PostgreSQL provider requires TLS. The build
   script builds the shared `@app/types` package before Nest. Provide a hosted
   PostgreSQL database reachable from Vercel.
2. Select `packages/react-client` as the frontend project root. Set its
   `API_ORIGIN` environment variable to the backend deployment's HTTPS origin,
   for example `https://your-backend.vercel.app`, without `/api`. The frontend's
   Vercel configuration builds the shared types and SPA, proxies `/api` to that
   origin, and serves `index.html` for frontend routes.

Set the correct backend origin and database separately for production and
preview environments. An API origin points to a specific deployment or stable
alias; it does not automatically follow the matching Git preview. Preview
deployment protection must allow the frontend rewrite to reach the backend.
After configuring environment variables, redeploy the affected project.

Run migrations against the intended database before using a deployment;
automatic migrations are disabled. From the repository root, with the target
database environment variables set, run:

```sh
pnpm --filter @app/nest-server run-migrations
```

Never run migrations against production from an unreviewed preview. Configure
separate preview data and secrets. Do not commit environment files or secrets.
