update:
	bunx npm-check-updates -u
	bun i

update-shadcn-ui:
	bunx --bun shadcn@latest add -a -o -y
	bunx --bun shadcn@latest migrate radix -y

create-migration:
	bun drizzle-kit generate

apply-migration:
	bun wrangler d1 migrations apply open-stack-cloudflare --local
