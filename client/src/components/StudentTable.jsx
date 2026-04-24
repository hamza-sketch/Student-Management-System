// StudentTable.jsx
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, BookOpen } from "lucide-react";

const STATUS_STYLES = {
  Active:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Inactive:  "bg-slate-100 text-slate-600 border border-slate-200",
  Suspended: "bg-red-50 text-red-600 border border-red-200",
};

function SortIcon({ field, sortConfig }) {
  if (sortConfig.field !== field) return <ChevronsUpDown size={13} className="text-slate-300" />;
  return sortConfig.direction === "asc"
    ? <ChevronUp   size={13} className="text-[#111E48]" />
    : <ChevronDown size={13} className="text-[#111E48]" />;
}

const COLUMNS = [
  { key: "registrationNumber", label: "Student ID",   sortable: true  },
  { key: "name",               label: "Full Name",    sortable: true  },
  { key: "email",              label: "Email",        sortable: true  },
  { key: "phone",              label: "Phone",        sortable: false },
  { key: "dateOfBirth",        label: "Date of Birth",sortable: true  },
  { key: "gender",             label: "Gender",       sortable: false },
  { key: "status",             label: "Status",       sortable: true  },
  { key: "createdAt",          label: "Enrolled",     sortable: true  },
  { key: "enrollments",        label: "Courses",      sortable: false },
  { key: "actions",            label: "Actions",      sortable: false },
];

const PAGE_SIZES = [10, 25, 50];

export default function StudentTable({
  students,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortConfig,
  onSort,
  selectedIds,
  onSelectChange,
  onView,
  onEdit,
  onDelete,
  loading,
}) {
  // ✅ FIX: removed stale useEffect debug log — it only fired on mount so
  //    `students` was always [] and provided no useful information.

  const allSelected =
    students.length > 0 && students.every((s) => selectedIds.includes(s.id));

  const toggleAll = () => {
    if (allSelected) onSelectChange([]);
    else onSelectChange(students.map((s) => s.id));
  };

  const toggleOne = (id) => {
    onSelectChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-10 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-[#111E48] focus:ring-[#111E48]/30"
                />
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none hover:text-slate-700" : ""
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} sortConfig={sortConfig} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 w-4 bg-slate-200 rounded" /></td>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-4 py-16 text-center text-slate-400">
                  <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No students found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className={`group transition-colors hover:bg-slate-50 ${
                    selectedIds.includes(student.id) ? "bg-blue-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => toggleOne(student.id)}
                      className="rounded border-slate-300 text-[#111E48] focus:ring-[#111E48]/30"
                    />
                  </td>

                  {/* Student ID */}
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                      {student.registrationNumber || "—"}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#111E48] to-blue-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {student.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="font-medium text-slate-800">{student.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3.5 text-slate-600">{student.email}</td>

                  {/* Phone */}
                  <td className="px-4 py-3.5 text-slate-600">{student.phone || "—"}</td>

                  {/* DOB */}
                  <td className="px-4 py-3.5 text-slate-600">{formatDate(student.dateOfBirth)}</td>

                  {/* Gender */}
                  <td className="px-4 py-3.5 text-slate-600 capitalize">{student.gender || "—"}</td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs rounded-full font-medium ${
                        STATUS_STYLES[student.status] ?? STATUS_STYLES.Inactive
                      }`}
                    >
                      {student.status || "Inactive"}
                    </span>
                  </td>

                  {/* Enrolled date */}
                  <td className="px-4 py-3.5 text-slate-600">{formatDate(student.createdAt)}</td>

                  {/* Courses count */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                      <BookOpen size={13} className="text-slate-400" />
                      {student.enrollmentCount ?? 0}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(student)}
                        title="View details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        title="Edit student"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        title="Delete student"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: page size + pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#111E48]/30"
          >
            {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <span>
            {Math.min((page - 1) * pageSize + 1, totalCount)}–
            {Math.min(page * pageSize, totalCount)} of {totalCount}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(1)} disabled={page === 1}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white transition-colors">«</button>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white transition-colors">‹ Prev</button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
            if (p < 1 || p > totalPages) return null;
            return (
              <button key={p} onClick={() => onPageChange(p)}
                className={`w-8 py-1.5 text-xs rounded-lg border transition-colors font-medium ${
                  p === page
                    ? "bg-[#111E48] text-white border-[#111E48]"
                    : "border-slate-200 text-slate-600 hover:bg-white"
                }`}>
                {p}
              </button>
            );
          })}

          <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white transition-colors">Next ›</button>
          <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white transition-colors">»</button>
        </div>
      </div>
    </div>
  );
}
