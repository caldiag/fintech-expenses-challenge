import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

type RecordTablePaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function RecordTablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: RecordTablePaginationProps) {
  const pageCount = Math.max(totalPages, 1)
  const visiblePages = getVisiblePages(pageCount, currentPage)
  const isFirstPage = currentPage <= 0
  const isLastPage = currentPage >= pageCount - 1

  return (
    <Pagination className="mx-0 mt-4 w-auto justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text="Anterior"
            aria-label="Página anterior"
            aria-disabled={isFirstPage}
            className={isFirstPage ? "pointer-events-none opacity-50" : ""}
            onClick={(event) => {
              event.preventDefault()
              if (!isFirstPage) onPageChange(currentPage - 1)
            }}
          />
        </PaginationItem>
        {visiblePages.map((page, index) => (
          <PaginationItem key={`${page ?? "ellipsis"}-${index}`}>
            {page === null ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                aria-label={`Ir para página ${page + 1}`}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(page)
                }}
              >
                {page + 1}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            text="Próxima"
            aria-label="Próxima página"
            aria-disabled={isLastPage}
            className={isLastPage ? "pointer-events-none opacity-50" : ""}
            onClick={(event) => {
              event.preventDefault()
              if (!isLastPage) onPageChange(currentPage + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function getVisiblePages(
  totalPages: number,
  currentPage: number
): (number | null)[] {
  const pages = new Set<number>([0, totalPages - 1])
  for (
    let page = Math.max(1, currentPage - 1);
    page <= Math.min(totalPages - 2, currentPage + 1);
    page++
  ) {
    pages.add(page)
  }

  const visiblePages: (number | null)[] = []
  for (const page of [...pages].sort((a, b) => a - b)) {
    const previousPage = visiblePages.at(-1)
    if (typeof previousPage === "number" && page - previousPage > 2) {
      visiblePages.push(null)
    } else if (typeof previousPage === "number" && page - previousPage === 2) {
      visiblePages.push(previousPage + 1)
    }
    visiblePages.push(page)
  }
  return visiblePages
}
