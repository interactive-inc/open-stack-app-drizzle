/**
 * Internal Error
 */
export class InternalError extends Error {
  constructor(message = "Internal server error") {
    super(message)
    this.name = "InternalError"
  }
}
