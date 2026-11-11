import { PermissionKey } from "@app/types"
import { useEffect, useState } from "react"
import type { FieldValues, UseFormReset } from "react-hook-form"
import axiosClient from "~/auth/axios-client"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import { toast } from "~/components/ui/toast"
import { hasRecordScopeAccess } from "~/lib/utils/record-permissions"

type ScopedRecord = NonNullable<Parameters<typeof hasRecordScopeAccess>[2]>

type RecordFormMessages = {
  loadError: string
  saveError: string
  deleteError: string
  deleteConfirm: string
  created: string
  updated: string
  deleted: string
}

export function useRecordForm<
  TRecord extends ScopedRecord,
  TFormValues extends FieldValues,
>({
  recordId,
  endpoint,
  createEndpoint,
  updatePermission,
  deletePermission,
  reset,
  mapRecord,
  onCreated,
  messages,
}: {
  recordId?: string
  endpoint: string
  createEndpoint: string
  updatePermission: PermissionKey
  deletePermission: PermissionKey
  reset: UseFormReset<TFormValues>
  mapRecord: (record: TRecord) => TFormValues
  onCreated: () => void
  messages: RecordFormMessages
}) {
  const { authContext } = useAuthContext()
  const [record, setRecord] = useState<TRecord>()
  const [isLoadingRecord, setIsLoadingRecord] = useState(Boolean(recordId))
  const [isSavingRecord, setIsSavingRecord] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!recordId) return
    let active = true
    setRecord(undefined)
    setError(null)
    setIsLoadingRecord(true)
    axiosClient
      .get<TRecord>(`${endpoint}/${recordId}`)
      .then(({ data }) => {
        if (!active) return
        setRecord(data)
        reset(mapRecord(data))
      })
      .catch(() => {
        if (active) setError(messages.loadError)
      })
      .finally(() => {
        if (active) setIsLoadingRecord(false)
      })
    return () => {
      active = false
    }
  }, [endpoint, mapRecord, messages.loadError, recordId, reset])

  const canEdit =
    !recordId ||
    hasRecordScopeAccess(
      authContext?.permissionSet[updatePermission],
      authContext,
      record
    )
  const canDelete =
    Boolean(recordId) &&
    hasRecordScopeAccess(
      authContext?.permissionSet[deletePermission],
      authContext,
      record
    )

  async function saveRecord(payload: unknown) {
    setError(null)
    setIsSavingRecord(true)
    try {
      if (recordId) {
        await axiosClient.patch(`${endpoint}/${recordId}`, payload)
      } else {
        await axiosClient.post(createEndpoint, payload)
      }
      toast.add({
        type: "success",
        title: "Sucesso",
        description: recordId ? messages.updated : messages.created,
      })
      onCreated()
    } catch {
      setError(messages.saveError)
    } finally {
      setIsSavingRecord(false)
    }
  }

  async function deleteRecord() {
    if (!recordId || !window.confirm(messages.deleteConfirm)) return
    try {
      await axiosClient.delete(`${endpoint}/${recordId}`)
      toast.add({
        type: "success",
        title: "Sucesso",
        description: messages.deleted,
      })
      onCreated()
    } catch {
      setError(messages.deleteError)
    }
  }

  return {
    canDelete,
    canEdit,
    deleteRecord,
    error,
    isLoadingRecord,
    isSavingRecord,
    saveRecord,
    setError,
  }
}
