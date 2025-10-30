/// <reference types="vite/client" />

import { createRootRoute } from "@tanstack/react-router"
import { CustomErrorComponent } from "@/components/custom-error-component"
import { NotFoundComponent } from "@/components/not-found-component"
import { ShellComponent } from "@/components/shell-component"
import styles from "@/styles.css?url"
import { seo } from "@/utils/seo"

export const Route = createRootRoute({
  errorComponent: CustomErrorComponent,
  notFoundComponent: () => <NotFoundComponent />,
  shellComponent: ShellComponent,
  head() {
    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...seo({
          title: "TanStack Start",
          description:
            "TanStack Start is a type-safe, client-first, full-stack React framework.",
        }),
      ],
      links: [
        { rel: "stylesheet", href: styles },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
        { rel: "icon", href: "/favicon.ico" },
      ],
      scripts: [{ src: "/customScript.js", type: "text/javascript" }],
    }
  },
})
