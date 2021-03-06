export function isNullOrUndefined<T>(value: T | undefined | null): value is null | undefined {
  return value === null || value === undefined
}

export function isNotNullOrUndefined<T>(value: T | undefined | null): value is T {
  return !isNullOrUndefined(value)
}

export function getOrThrow<T>(value: T | null | undefined, errorMessage = "Unexpected missing value"): T {
  if (isNullOrUndefined(value)) {
    throw new Error(errorMessage)
  }
  return value
}
