export type ApiError = {
  message: string
  code?: string
}

export function jsonSuccess<T>(data: T, init?: ResponseInit) {
  return Response.json({ data, error: null }, init)
}

export function jsonError(message: string, status = 400, code?: string) {
  const error: ApiError = { message, code }
  return Response.json({ data: null, error }, { status })
}
