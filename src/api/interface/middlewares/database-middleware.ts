import { drizzle } from "drizzle-orm/d1"
import { factory } from "@/api/interface/factory"
import { schema } from "@/schema"

/**
 * c.var.databaseにDrizzleのClientを設定する
 */
export const databaseMiddleware = factory.createMiddleware((c, next) => {
  const client = drizzle(c.env.DB, { schema })

  c.set("database", client)

  return next()
})
