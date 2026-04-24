// Student.jsx
import { useState, useEffect, useCallback } from "react";
import { UserPlus, Trash2, Users, UserCheck, UserX, GraduationCap } from "lucide-react";

import StudentFilters from "../components/StudentFilters";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import StudentTable from "../components/StudentTable.jsx";
import AddEditStudentModal from "../components/Addeditstudentmodal.jsx";
import ViewStudentModal from "../components/Viewstudentmodal.jsx";

import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkDeleteStudents,
} from "../services/APIs/student.api.js";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? "—"}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentsPage() {
  // ── Data state ──
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);

  // ── Table controls ──
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ field: "createdAt", direction: "desc" });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "All", year: "All Years" });

  // ── Selection ──
  const [selectedIds, setSelectedIds] = useState([]);

  // ── Modals ──
  const [addEditModal, setAddEditModal] = useState({ open: false, student: null });
  const [viewModal, setViewModal] = useState({ open: false, student: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, student: null, isBulk: false });
  const [modalLoading, setModalLoading] = useState(false);

  // ─── Load Students ──────────────────────────────────────────────────────────
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        sortBy: sortConfig.field,
        sortDir: sortConfig.direction,
        ...(search && { search }),
        ...(filters.status !== "All" && { status: filters.status }),
        ...(filters.year !== "All Years" && { year: filters.year }),
      };

      const res = await fetchStudents(params);

      // ✅ FIX: Normalize each student so `id` is always available.
      // Backend returns `studentId` (the Student doc _id) but the table,
      // selection logic, ViewModal and EditModal all rely on `student.id`.
      const normalized = (res.data ?? []).map((s) => ({
        ...s,
        id: s.studentId ?? s.id, // prefer studentId, fall back to id
      }));

      setStudents(normalized);
      setTotalCount(res.stats?.total ?? 0);
      setStats({
        total:     res.stats?.total     ?? 0,
        active:    res.stats?.active    ?? 0,
        inactive:  res.stats?.inactive  ?? 0,
        suspended: res.stats?.suspended ?? 0,
      });
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortConfig, search, filters]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Reset to page 1 when search/filters change
  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  // ─── Sort handler ───────────────────────────────────────────────────────────
  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ─── Add / Edit ─────────────────────────────────────────────────────────────
  const handleSave = async (formData, studentId) => {
    setModalLoading(true);
    try {
      if (studentId) {
        await updateStudent(studentId, formData);
      } else {
        await createStudent(formData);
      }
      setAddEditModal({ open: false, student: null });
      loadStudents();
    } catch (err) {
      console.error("Save failed:", err);
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Try again.");
      }
    } finally {
      setModalLoading(false);
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setModalLoading(true);
    try {
      if (deleteDialog.isBulk) {
        await bulkDeleteStudents(selectedIds);
        setSelectedIds([]);
      } else {
        await deleteStudent(deleteDialog.student.studentId);
      }
      setDeleteDialog({ open: false, student: null, isBulk: false });
      loadStudents();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all student records, enrollments, grades and attendance.
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setDeleteDialog({ open: true, student: null, isBulk: true })}
              className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold hover:bg-red-100 transition-colors"
            >
              <Trash2 size={15} />
              Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setAddEditModal({ open: true, student: null })}
            className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-[#111E48] text-white font-semibold hover:bg-[#1a2d5a] transition-colors shadow-sm"
          >
            <UserPlus size={16} />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}        label="Total Students" value={stats.total}     color="bg-[#111E48]"    />
        <StatCard icon={UserCheck}    label="Active"         value={stats.active}    color="bg-emerald-500" />
        <StatCard icon={UserX}        label="Inactive"       value={stats.inactive}  color="bg-slate-400"   />
        <StatCard icon={GraduationCap} label="Suspended"     value={stats.suspended} color="bg-red-400"     />
      </div>

      {/* Filters */}
      <StudentFilters
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={loadStudents}
        loading={loading}
      />

      {/* Table */}
      <StudentTable
        students={students}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        sortConfig={sortConfig}
        onSort={handleSort}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        onView={(s) => setViewModal({ open: true, student: s })}
        onEdit={(s) => setAddEditModal({ open: true, student: s })}
        onDelete={(s) => setDeleteDialog({ open: true, student: s, isBulk: false })}
        loading={loading}
      />

      {/* ── Modals ── */}
      {addEditModal.open && (
        <AddEditStudentModal
          student={addEditModal.student}
          onClose={() => setAddEditModal({ open: false, student: null })}
          onSave={handleSave}
          loading={modalLoading}
        />
      )}

      {viewModal.open && (
        <ViewStudentModal
          student={viewModal.student}
          onClose={() => setViewModal({ open: false, student: null })}
        />
      )}

      {deleteDialog.open && (
        <DeleteConfirmDialog
          student={deleteDialog.student}
          count={selectedIds.length}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialog({ open: false, student: null, isBulk: false })}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
