update:
	vp update
	vp install

create-migration:
	vp exec drizzle-kit generate

apply-migration:
	vp exec wrangler d1 migrations apply open-stack-cloudflare --local
