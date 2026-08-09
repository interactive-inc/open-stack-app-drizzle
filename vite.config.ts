import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite-plus"

export default defineConfig({
  fmt: {
    semi: false,
  },
  lint: {
    ignorePatterns: [
      ".nitro/**",
      ".output/**",
      ".tanstack/**",
      ".wrangler/**",
      "src/components/ui/**",
      "src/hooks/use-mobile.ts",
      "src/route-tree.gen.ts",
      "worker-configuration.d.ts",
    ],
  },
  test: {
    passWithNoTests: true,
  },
  resolve: { alias: { "@": "/src" } },
  plugins: [
    ...(process.env.VITEST ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
    tanstackStart({
      spa: { enabled: false },
      router: { generatedRouteTree: "route-tree.gen.ts" },
    }),
    viteReact(),
    tailwindcss(),
  ],
})
