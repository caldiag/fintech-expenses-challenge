import { useCallback, useEffect, useRef, useState } from "react"
import axiosClient from "~/auth/axios-client"

export type ContactOption = {
  id: string
  name: string
  avatarUrl: string | null
  email: string
  phone: string | null
  companies: { id: string; name: string }[]
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

type ContactPage = {
  contacts: ContactOption[]
  total: number
  totalPages: number
}

export function usePaginatedContacts() {
  const [contacts, setContacts] = useState<ContactOption[]>([])
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
      const response = await axiosClient.get<ContactPage>("/contact/all", {
        params: { page: pageRef.current },
      })
      setContacts((current) => [...current, ...response.data.contacts])
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
    contacts,
    hasError,
    isLoading,
    loadNextPage,
  }
}
