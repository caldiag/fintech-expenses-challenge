import { IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "../../ui/button"
import { DialogFooter } from "../../ui/dialog"

export function RecordFormFooter({
  loadingMessage,
  isLoadingRecord,
  canDelete,
  onDelete,
  canEdit,
  isSaving,
  isSubmitDisabled = false,
  recordId,
}: {
  loadingMessage: string
  isLoadingRecord: boolean
  canDelete: boolean
  onDelete: () => void
  canEdit: boolean
  isSaving: boolean
  isSubmitDisabled?: boolean
  recordId?: string
}) {
  return (
    <DialogFooter className="mt-4">
      {isLoadingRecord && <span>{loadingMessage}</span>}
      {canDelete && (
        <Button type="button" variant="destructive" onClick={onDelete}>
          Excluir
        </Button>
      )}
      {canEdit && (
        <Button type="submit" disabled={isSaving || isSubmitDisabled}>
          <IconDeviceFloppy />
          {isSaving ? "Salvando..." : recordId ? "Salvar alterações" : "Salvar"}
        </Button>
      )}
    </DialogFooter>
  )
}
