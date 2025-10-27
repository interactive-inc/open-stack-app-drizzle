# Stack App with API - TanStack Start + Hono + Cloudflare + Drizzle

https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack/

## Getting Started

### Install the dependencies

```bash
bun i
```

### Start the development server

```bash
bun dev
```

### Build for Production

```bash
bun build
```

### Preview the production build

```bash
bun preview
```

### Deploy to Cloudflare

```sh
bun run deploy
```

## Accessing bindings

You can access Cloudflare bindings in server functions by using importable `env`:

```ts
import { env } from 'cloudflare:workers'
```

See `src/api/routes/index.ts` for an example.

## Bugs

### SPAモードでビルドすると失敗する

この設定の`spa`を`true`にすると、ビルドに失敗します。

```
export default defineConfig({
  plugins: [
    tanstackStart({
      spa: { enabled: true },
    }),
  ],
})

```

このようなエラーが発生する。

```
error during build:
TypeError: Cannot read properties of undefined (reading 'compatibilityFlags')
```

## マイグレーション

ここでは仮に「open-stack-cloudflare」というデータベース名を使用します。これは[.wrangler.json](./wrangler.json)の `database_name` と一致させてください。

以下のコマンドでマイグレーションのファイルを作成します。

```
make create-migration
```


以下のコマンドでローカルのデータベースを更新します。

```
make apply-migration-local
```

もしくは

```
bun wrangler d1 migrations apply open-stack-cloudflare --local
```

### リモート環境のマイグレーション

以下のコマンドで本番環境のデータベースを更新します。

```
bun wrangler d1 migrations apply open-stack-cloudflare --remote
```

ただし、先にデータベースが作成されている必要があります。

```
bun wrangler d1 create open-stack-cloudflare
```

### リモートのデータベースと接続する

プロパティに`remote`を追加します。

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "open-stack-cloudflare",
      "database_id": "e0097010-e9a1-4800-8a7e-xxx",
      "remote": true
    }
  ]
}
```

# メモ

## ~ vs @

初期値では `~` ですが、Claudeが間違って `rm -rf ~/xxx` など実行した場合に危険なので `@` に変更しました。

```json
{ "resolve": { "alias": { "@": "/src" } } }
```

## route-tree.gen.ts

初期値では `routeTree.gen.ts` ですが、Claudeがこのファイル名を参考に他のファイルの命名規則を間違って `camelCase` にしてしまう可能性があるので、`kebab-case` に変更しました。

```json
{ "router": { "generatedRouteTree": "route-tree.gen.ts" } }
```
