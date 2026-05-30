'use client'

// Global error toast utilities
import { toastError, toastSuccess, toastLoading, toastDismiss } from '@/lib/toast'
import { getErrorMessage } from '@/lib/errors'

/**
 * showError — show a standardised error toast
 * Handles RenlioError, standard Error, and strings
 */
export function showError(error: unknown): void {
  const message = getErrorMessage(error)
  toastError(message)
}

/**
 * showSuccess — show a standardised success toast
 */
export function showSuccess(message: string): void {
  toastSuccess(message)
}

/**
 * withLoadingToast — wraps an async operation with loading/success/error toasts
 * Usage: await withLoadingToast(saveData(), 'Saving...', 'Saved successfully')
 */
export async function withLoadingToast<T>(
  promise: Promise<T>,
  loadingMessage: string,
  successMessage: string
): Promise<T> {
  const toastId = toastLoading(loadingMessage)
  try {
    const result = await promise
    toastDismiss(toastId)
    toastSuccess(successMessage)
    return result
  } catch (error) {
    toastDismiss(toastId)
    showError(error)
    throw error
  }
}

/**
 * useFormError — React hook for handling form submission errors
 * Returns a setError function that shows a toast and returns false
 * so the form handler can bail out gracefully
 */
export function useFormError() {
  return {
    handleError: (error: unknown): void => {
      showError(error)
    },
    handleSuccess: (message: string): void => {
      showSuccess(message)
    },
  }
}
