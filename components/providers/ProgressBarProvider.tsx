"use client"

import { ReactNode } from "react"
import { AppProgressBar } from "next-nprogress-bar"

interface ProgressBarProviderProps {
  children: ReactNode
}

export function ProgressBarProvider({ children }: ProgressBarProviderProps) {
  return (
    <>
      <AppProgressBar
        height="3px"
        color="#3B82F6"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  )
}
