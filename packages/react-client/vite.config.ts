import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"
import { defineConfig, searchForWorkspaceRoot } from "vite"

const workspaceRoot = searchForWorkspaceRoot(
  fileURLToPath(new URL("../..", import.meta.url))
)

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    host: true,
    fs: { allow: [workspaceRoot] },
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [tailwindcss(), reactRouter()],
})
