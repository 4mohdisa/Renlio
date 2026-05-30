import { toast } from "sonner"

export function toastSuccess(message: string) {
  toast.success(message, {
    style: {
      background: "#D1FAE5",
      color: "#047857",
      border: "1px solid #059669",
    },
  })
}

export function toastError(message: string) {
  toast.error(message, {
    style: {
      background: "#FEE2E2",
      color: "#DC2626",
      border: "1px solid #DC2626",
    },
  })
}

export function toastLoading(message: string) {
  return toast.loading(message, {
    style: {
      background: "#E0F2FE",
      color: "#0369A1",
      border: "1px solid #0284C7",
    },
  })
}

export function toastDismiss(id: string | number) {
  toast.dismiss(id)
}
