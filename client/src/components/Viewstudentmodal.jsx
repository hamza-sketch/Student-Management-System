// Viewstudentmodal.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, User, BookOpen, BarChart3, CalendarCheck, Activity,
  ExternalLink, Loader2, Mail, Phone, MapPin, Calendar,
  Hash, KeyRound, Eye, EyeOff,
} from "lucide-react";
import {
  fetchStudentEnrollments,
  fetchStudentGrades,
  fetchStudentAttendance,
} from "../services/APIs/student.api";

const TABS = [
  { key: "profile",    label: "Profile",    icon: User          },
  { key: "courses",    label: "Courses",    icon: BookOpen      },
  { key: "grades",     label: "Grades",     icon: BarChart3     },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "activity",   label: "Activity",   icon: Activity      },
];

const STATUS_STYLES = {
  Active:    "bg-emerald-50 text-emerald-700",
  Inactive:  "bg-slate-100 text-slate-600",
  Suspended: "bg-red-50 text-red-600",
  enrolled:  "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  dropped:   "bg-red-50 text-red-600",
};

// ─── Shared helpers ────────────────────────────────────────────────────────────

function DetailItem({ icon: Icon, label, value, children }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        {children ?? (
          <p className="text-sm text-slate-700 font-medium mt-0.5 break-words">{value || "—"}</p>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-slate-400" />
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-16 text-slate-400">
      <p className="font-medium">{message}</p>
    </div>
  );
}

// ─── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ student }) {
  // ✅ Toggle to show/hide the temporary password
  const [showPassword, setShowPassword] = useState(false);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
      : "—";

  return (
    <div className="space-y-4">
      {/* Avatar + name header */}
      <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#111E48] to-blue-500 rounded-2xl text-white">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shrink-0">
          {student.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold">{student.name}</h3>
          <p className="text-sm text-white/70">{student.email}</p>
          <span
            className={`inline-block mt-1.5 px-2.5 py-0.5 text-xs rounded-full font-medium ${
              STATUS_STYLES[student.status] ?? "bg-white/20 text-white"
            }`}
          >
            {student.status}
          </span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl px-4 py-1">
        <DetailItem icon={Hash}     label="Registration Number" value={student.registrationNumber} />
        <DetailItem icon={Mail}     label="Email Address"        value={student.email}             />
        <DetailItem icon={Phone}    label="Phone Number"         value={student.phone}             />
        <DetailItem icon={Calendar} label="Date of Birth"        value={formatDate(student.dateOfBirth)} />
        <DetailItem icon={User}     label="Gender"               value={student.gender}            />
        <DetailItem icon={MapPin}   label="Address"              value={student.address}           />
        <DetailItem icon={Calendar} label="Registered On"        value={formatDate(student.createdAt)} />

        {/* ✅ Temp password row — visible only to admins via this modal */}
        <DetailItem icon={KeyRound} label="Temporary Password">
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-mono font-semibold text-slate-700 tracking-wider">
              {student.tempPassword
                ? showPassword
                  ? student.tempPassword
                  : "••••••••"
                : "—"}
            </span>
            {student.tempPassword && (
              <button
                onClick={() => setShowPassword((p) => !p)}
                className="text-slate-400 hover:text-[#111E48] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Share this with the student for first login. Advise them to change it.
          </p>
        </DetailItem>
      </div>
    </div>
  );
}

// ─── Courses Tab ───────────────────────────────────────────────────────────────
function CoursesTab({ studentId }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    fetchStudentEnrollments(studentId)
      .then((res) => setData(res?.enrollments ?? res ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <LoadingState />;
  if (!data.length) return <EmptyState message="No enrolled courses found." />;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{data.length}</span> course(s) enrolled
        </p>
        <button
          onClick={() => navigate(`/purchase?studentId=${studentId}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#111E48] hover:underline"
        >
          View all in Enrollments <ExternalLink size={12} />
        </button>
      </div>

      {data.map((enr) => (
        <div
          key={enr.id}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {enr.course?.courseName ?? enr.courseId}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Code: {enr.course?.courseCode ?? "—"} · Credits: {enr.course?.credits ?? "—"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Enrolled:{" "}
              {enr.enrollmentDate
                ? new Date(enr.enrollmentDate).toLocaleDateString("en-GB")
                : "—"}
            </p>
          </div>
          <span
            className={`px-2.5 py-0.5 text-xs rounded-full font-medium capitalize ${
              STATUS_STYLES[enr.status?.toLowerCase()] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {enr.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Grades Tab ────────────────────────────────────────────────────────────────
function GradesTab({ studentId }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    fetchStudentGrades(studentId)
      .then((res) => setData(res?.grades ?? res ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <LoadingState />;
  if (!data.length) return <EmptyState message="No grade records found." />;

  const withMarks = data.filter((g) => g.marks != null);
  const avg = withMarks.length
    ? withMarks.reduce((s, g) => s + Number(g.marks), 0) / withMarks.length
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#111E48] text-white flex items-center justify-center text-lg font-bold">
            {avg.toFixed(0)}
          </div>
          <div>
            <p className="text-xs text-slate-500">Average Score</p>
            <p className="text-sm font-semibold text-slate-700">{avg.toFixed(1)} / 100</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/inventory?studentId=${studentId}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#111E48] hover:underline"
        >
          View all in Grades <ExternalLink size={12} />
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["Course", "Semester", "Marks", "Grade"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-700">{g.course?.courseName ?? g.courseId}</td>
                <td className="px-4 py-3 text-slate-500">{g.semester ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">{g.marks ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-[#111E48]/10 text-[#111E48] text-xs rounded-lg font-bold">
                    {g.grade ?? "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Attendance Tab ────────────────────────────────────────────────────────────
function AttendanceTab({ studentId }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentAttendance(studentId)
      .then((res) => setData(res?.attendance ?? res ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <LoadingState />;
  if (!data.length) return <EmptyState message="No attendance records found." />;

  const present = data.filter((a) => a.status === "present").length;
  const pct     = ((present / data.length) * 100).toFixed(1);

  const byCourse = data.reduce((acc, a) => {
    const key = a.course?.courseName ?? a.courseId ?? "Unknown";
    if (!acc[key]) acc[key] = { present: 0, total: 0 };
    acc[key].total++;
    if (a.status === "present") acc[key].present++;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Overall */}
      <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none" stroke="#111E48" strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#111E48]">
            {pct}%
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-700">Overall Attendance</p>
          <p className="text-xs text-slate-500">{present} present out of {data.length} classes</p>
        </div>
      </div>

      {/* Course breakdown */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Course-wise Breakdown</p>
        {Object.entries(byCourse).map(([course, stat]) => {
          const coursePct = ((stat.present / stat.total) * 100).toFixed(0);
          return (
            <div key={course} className="p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{course}</span>
                <span className="text-slate-500 text-xs">{stat.present}/{stat.total}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${Number(coursePct) >= 75 ? "bg-emerald-500" : "bg-red-400"}`}
                  style={{ width: `${coursePct}%` }}
                />
              </div>
              <p className={`text-xs mt-1 font-medium ${Number(coursePct) >= 75 ? "text-emerald-600" : "text-red-500"}`}>
                {coursePct}%{Number(coursePct) < 75 && " — Below minimum (75%)"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Activity Tab ──────────────────────────────────────────────────────────────
function ActivityTab({ student }) {
  const events = [
    { label: "Account Created", date: student.createdAt, color: "bg-blue-400"    },
    { label: "Last Updated",    date: student.updatedAt, color: "bg-amber-400"   },
    { label: "Last Login",      date: student.lastLogin, color: "bg-emerald-400" },
  ].filter((e) => e.date);

  if (!events.length) return <EmptyState message="No activity log available." />;

  return (
    <div className="relative pl-4">
      <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-slate-200" />
      {events.map((ev, i) => (
        <div key={i} className="flex items-start gap-4 mb-6">
          <div className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${ev.color} ring-2 ring-white`} />
          <div>
            <p className="text-sm font-semibold text-slate-700">{ev.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{new Date(ev.date).toLocaleString("en-GB")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function ViewStudentModal({ student, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Student Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-3 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === key
                  ? "border-[#111E48] text-[#111E48]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto flex-1 p-6">
          {activeTab === "profile"    && <ProfileTab    student={student}              />}
          {activeTab === "courses"    && <CoursesTab    studentId={student.id}         />}
          {activeTab === "grades"     && <GradesTab     studentId={student.id}         />}
          {activeTab === "attendance" && <AttendanceTab studentId={student.id}         />}
          {activeTab === "activity"   && <ActivityTab   student={student}              />}
        </div>
      </div>
    </div>
  );
}