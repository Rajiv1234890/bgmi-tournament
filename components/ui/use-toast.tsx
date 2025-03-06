"use client"

import type React from "react"

// Simplified version of the toast component
import { useState, useEffect } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

let toastId = 0
const toasts: ToastProps[] = []
let setToastsState: React.Dispatch<React.SetStateAction<ToastProps[]>> | null = null

export function toast(props: ToastProps) {
  const id = toastId++
  const newToast = { ...props, id }

  if (setToastsState) {
    setToastsState((prev) => [...prev, newToast])

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToastsState!((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return { id, dismiss: () => {} }
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    setToastsState = setToasts
    return () => {
      setToastsState = null
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md">
      {toasts.map((toast, i) => (
        <div
          key={i}
          className={`rounded-lg border p-4 shadow-md ${
            toast.variant === "destructive" ? "bg-red-50 border-red-200 text-red-900" : "bg-white border-gray-200"
          }`}
        >
          {toast.title && <div className="font-medium">{toast.title}</div>}
          {toast.description && <div className="text-sm text-gray-500">{toast.description}</div>}
        </div>
      ))}
    </div>
  )
}

