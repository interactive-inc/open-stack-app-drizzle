import { describe, expect, test } from "bun:test"
import { seo } from "./seo"

describe("seo", () => {
  test("should return basic meta tags with required title", () => {
    const result = seo({ title: "Test Page" })

    expect(result).toContainEqual({ title: "Test Page" })
    expect(result).toContainEqual({ name: "description", content: undefined })
    expect(result).toContainEqual({ name: "keywords", content: undefined })
    expect(result).toContainEqual({
      name: "twitter:title",
      content: "Test Page",
    })
    expect(result).toContainEqual({
      name: "twitter:description",
      content: undefined,
    })
    expect(result).toContainEqual({
      name: "twitter:creator",
      content: "@tannerlinsley",
    })
    expect(result).toContainEqual({
      name: "twitter:site",
      content: "@tannerlinsley",
    })
    expect(result).toContainEqual({ name: "og:type", content: "website" })
    expect(result).toContainEqual({ name: "og:title", content: "Test Page" })
    expect(result).toContainEqual({
      name: "og:description",
      content: undefined,
    })
  })

  test("should include description when provided", () => {
    const result = seo({
      title: "Test Page",
      description: "Test Description",
    })

    expect(result).toContainEqual({
      name: "description",
      content: "Test Description",
    })
    expect(result).toContainEqual({
      name: "twitter:description",
      content: "Test Description",
    })
    expect(result).toContainEqual({
      name: "og:description",
      content: "Test Description",
    })
  })

  test("should include keywords when provided", () => {
    const result = seo({
      title: "Test Page",
      keywords: "test, keywords",
    })

    expect(result).toContainEqual({
      name: "keywords",
      content: "test, keywords",
    })
  })

  test("should include image meta tags when image is provided", () => {
    const result = seo({
      title: "Test Page",
      image: "https://example.com/image.jpg",
    })

    expect(result).toContainEqual({
      name: "twitter:image",
      content: "https://example.com/image.jpg",
    })
    expect(result).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    })
    expect(result).toContainEqual({
      name: "og:image",
      content: "https://example.com/image.jpg",
    })
  })

  test("should not include image meta tags when image is not provided", () => {
    const result = seo({ title: "Test Page" })

    const hasTwitterImage = result.some((tag) => tag.name === "twitter:image")
    const hasTwitterCard = result.some((tag) => tag.name === "twitter:card")
    const hasOgImage = result.some((tag) => tag.name === "og:image")

    expect(hasTwitterImage).toBe(false)
    expect(hasTwitterCard).toBe(false)
    expect(hasOgImage).toBe(false)
  })

  test("should return all meta tags with all props provided", () => {
    const result = seo({
      title: "Complete Page",
      description: "Complete Description",
      image: "https://example.com/complete.jpg",
      keywords: "complete, test, all",
    })

    expect(result).toContainEqual({ title: "Complete Page" })
    expect(result).toContainEqual({
      name: "description",
      content: "Complete Description",
    })
    expect(result).toContainEqual({
      name: "keywords",
      content: "complete, test, all",
    })
    expect(result).toContainEqual({
      name: "twitter:title",
      content: "Complete Page",
    })
    expect(result).toContainEqual({
      name: "twitter:description",
      content: "Complete Description",
    })
    expect(result).toContainEqual({
      name: "twitter:image",
      content: "https://example.com/complete.jpg",
    })
    expect(result).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    })
    expect(result).toContainEqual({
      name: "og:title",
      content: "Complete Page",
    })
    expect(result).toContainEqual({
      name: "og:description",
      content: "Complete Description",
    })
    expect(result).toContainEqual({
      name: "og:image",
      content: "https://example.com/complete.jpg",
    })
  })
})
