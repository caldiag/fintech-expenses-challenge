import { useCallback, useEffect, useRef, useState } from "react"
import axiosClient from "~/auth/axios-client"

export type CompanyOption = {
  id: string
  name: string
  websiteUrl: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

type CompanyPage = {
  companies: CompanyOption[]
  total: number
  totalPages: number
}

export function usePaginatedCompanies() {
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const pageRef = useRef(0)
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(true)

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    loadingRef.current = true
    setIsLoading(true)
    setHasError(false)
    try {
      const response = await axiosClient.get<CompanyPage>("/company/all", {
        params: { page: pageRef.current },
      })
      setCompanies((current) => [...current, ...response.data.companies])
      pageRef.current += 1
      hasMoreRef.current = pageRef.current < response.data.totalPages
    } catch {
      setHasError(true)
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadNextPage()
  }, [loadNextPage])

  return {
    companies,
    hasError,
    hasMore: hasMoreRef.current,
    isLoading,
    loadNextPage,
  }
}
