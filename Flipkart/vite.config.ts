// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const BACKEND_TARGET = process.env.VITE_BACKEND_PROXY_TARGET ?? "https://fgr2-backend.mooo.com";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: true,
  vite: {
    server: {
      proxy: {
        // Dev-only: same-origin proxy avoids browser CORS on cross-domain API calls.
        "/api": {
          target: BACKEND_TARGET,
          changeOrigin: true,
          secure: true,
          ws: true,
        },
        "/static/output": {
          target: BACKEND_TARGET,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  },
});
