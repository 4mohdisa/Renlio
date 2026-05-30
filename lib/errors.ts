export type RenlioErrorType =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'NETWORK'
  | 'PERMISSION'
  | 'UNKNOWN'

export class RenlioError extends Error {
  type: RenlioErrorType
  userMessage: string

  constructor(type: RenlioErrorType, userMessage: string, originalMessage?: string) {
    super(originalMessage ?? userMessage)
    this.type = type
    this.userMessage = userMessage
    this.name = 'RenlioError'
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof RenlioError) return error.userMessage
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

export function isNotFound(error: unknown): boolean {
  return error instanceof RenlioError && error.type === 'NOT_FOUND'
}

export function isValidation(error: unknown): boolean {
  return error instanceof RenlioError && error.type === 'VALIDATION'
}

export function handleFormError(error: unknown): void {
  const message = getErrorMessage(error)
  // Will be replaced with toastError in Phase 2 when async operations exist
  console.error('[Renlio Form Error]', message)
}

export const ERROR_MESSAGES = {
  PROPERTY_NOT_FOUND: 'This property could not be found.',
  TENANCY_NOT_FOUND: 'This tenancy could not be found.',
  CONTACT_NOT_FOUND: 'This contact could not be found.',
  SUPPLIER_NOT_FOUND: 'This supplier could not be found.',
  ROOM_NOT_FOUND: 'This room could not be found.',
  SAVE_FAILED: 'Failed to save changes. Please try again.',
  DELETE_FAILED: 'Failed to delete. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please refresh the page.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
} as const
