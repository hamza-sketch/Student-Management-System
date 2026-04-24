// StudentFilters.jsx
import { Search, RefreshCw, Download, SlidersHorizontal, X } from "lucide-react";

const STATUS_OPTIONS = ["All", "Active", "Inactive", "Suspended"];
const YEAR_OPTIONS = ["All Years", "2021", "2022", "2023", "2024", "2025"];

export default function StudentFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onRefresh,
  loading,
}) {
  const hasActiveFilters =
    filters.status !== "All" || filters.year !== "All Years" || search !== "";

  const clearAll = () => {
    onSearchChange("");
    onFilterChange({ status: "All", year: "All Years" });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
      {/* Top row: search + actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, ID or phone…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111E48]/20 focus:border-[#111E48] transition-all text-slate-600"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh"
            className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            //onClick={onExport}
            title="Export CSV"
            className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <SlidersHorizontal size={14} />
          <span className="font-medium">Filters:</span>
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onFilterChange({ ...filters, status: s })}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-all border ${
                filters.status === s
                  ? "bg-[#111E48] text-white border-[#111E48]"
                  : "text-slate-600 border-slate-200 hover:border-[#111E48]/40 hover:text-[#111E48]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Year filter */}
        <select
          value={filters.year}
          onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#111E48]/20 focus:border-[#111E48] transition-all"
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="ml-auto flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <X size={12} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}