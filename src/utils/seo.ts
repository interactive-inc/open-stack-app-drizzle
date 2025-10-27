type Props = {
  title: string
  description?: string
  image?: string
  keywords?: string
}

export function seo(props: Props) {
  const tags = [
    { title: props.title },
    { name: "description", content: props.description },
    { name: "keywords", content: props.keywords },
    { name: "twitter:title", content: props.title },
    { name: "twitter:description", content: props.description },
    { name: "twitter:creator", content: "@tannerlinsley" },
    { name: "twitter:site", content: "@tannerlinsley" },
    { name: "og:type", content: "website" },
    { name: "og:title", content: props.title },
    { name: "og:description", content: props.description },
  ]

  if (props.image) {
    tags.push({ name: "twitter:image", content: props.image })
    tags.push({ name: "twitter:card", content: "summary_large_image" })
    tags.push({ name: "og:image", content: props.image })
  }

  return tags
}
