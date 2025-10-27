import { z } from "zod"

const zValue = z.string().max(128)

type Value = z.infer<typeof zValue>

export class NameValue {
  constructor(public readonly value: Value) {
    Object.assign(this, zValue.parse(value))
  }
}
