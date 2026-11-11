import Period from "~/components/data-display/summary-graph/period"
import TopCategories from "~/components/data-display/summary-graph/top-categories"
import Totals from "~/components/data-display/summary-graph/totals"

export default function Summary() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Totals />
      <Period />
      <TopCategories />
    </div>
  )
}
