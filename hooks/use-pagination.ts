"use client"

import { useState, useMemo } from "react"

interface UsePaginationProps<T> {
  data: T[]
  pageSize?: number
}

interface UsePaginationResult<T> {
  paginatedData: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  resetPage: () => void
}

export function usePagination<T>({
  data,
  pageSize = 10,
}: UsePaginationProps<T>): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)

  // Reset to page 1 when data changes
  useMemo(() => {
    setCurrentPage(1)
  }, [data.length])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return data.slice(start, end)
  }, [data, currentPage, pageSize])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const resetPage = () => {
    setCurrentPage(1)
  }

  return {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
  }
}
