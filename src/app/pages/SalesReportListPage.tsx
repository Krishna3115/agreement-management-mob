import { useEffect, useState } from "react";
import {
  salesReportService,
  SalesReport,
} from "../../services/salesReportService";
import {
  FileText,
  Mail,
  Loader2,
  Receipt,
  Paperclip,
  X,
  Plus,
  Eye,
  Download,
  Container as ContainerIcon,
} from "lucide-react";
import { useNavigate } from "react-router";

const PRIMARY = "#008d5b";

export default function SalesReportListPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState<SalesReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Send modal state
  const [sendTarget, setSendTarget] = useState<SalesReport | null>(null);
  const [pickedFiles, setPickedFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const [viewReport, setViewReport] = useState<SalesReport | null>(null);
  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await salesReportService.getAll();
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const next: File[] = [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      const isPdf =
        f.type === "application/pdf" ||
        f.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        alert(`Skipped non-PDF file: ${f.name}`);
        continue;
      }
      next.push(f);
    }
    setPickedFiles((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removePicked = (idx: number) =>
    setPickedFiles((p) => p.filter((_, i) => i !== idx));

  const closeModal = () => {
    setSendTarget(null);
    setPickedFiles([]);
  };

  const sendPlain = async () => {
    if (!sendTarget) return;
    setSending(true);
    try {
      await salesReportService.sendMail(sendTarget.id);
      alert("Sales Report email sent");
      closeModal();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Email failed");
    } finally {
      setSending(false);
    }
  };

  const sendWithAttachments = async () => {
    if (!sendTarget) return;
    if (pickedFiles.length === 0) {
      alert("Pick at least one PDF");
      return;
    }
    setSending(true);
    try {
      await salesReportService.sendMailWithAttachments(
        sendTarget.id,
        pickedFiles
      );
      alert("Sales Report email sent with merged attachments");
      closeModal();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Email failed");
    } finally {
      setSending(false);
    }
  };

  const downloadPdf = async (report: SalesReport) => {
  try {
    // Replace this with your actual service method
    await salesReportService.downloadPdf(report.id);
  } catch (err) {
    console.error(err);
    alert("Failed to download PDF");
  }
};
  // ─────────────── LOADING ───────────────
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={28} />
      </div>
    );
  }

  // ─────────────── RENDER ───────────────
  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg,#eefaf3 0%,#f6f9f7 22%,#f8fafc 100%)' }}>

      {/* HEADER */}
      <div
        className="relative overflow-hidden px-5 pt-7 pb-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #008d5b 0%, #00663f 100%)',
          borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
        }}
      >
        <div className="pointer-events-none absolute -top-16 -right-10 w-52 h-52 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#9bffd0,transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-20 -left-8 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#ffffff,transparent 70%)' }} />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Exponab</p>
            <h1 className="text-2xl font-bold leading-tight mt-0.5">Sales Reports</h1>
            <p className="text-white/80 text-sm mt-1">
              Total Reports: {reports.length}
            </p>
          </div>
          <button
            onClick={() => navigate("/sales-orders")}
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            <Plus size={22} color={PRIMARY} />
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="p-4 space-y-4">
        {reports.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <Receipt className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500 text-sm">No Sales Reports Found</p>
          </div>
        )}

        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]"
          >
            {/* TOP ROW */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "#e6f6f0" }}
                >
                  <FileText size={20} color={PRIMARY} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    #{r.reportNumber}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{r.customerName}</p>
                  {r.containerNumber && (
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <ContainerIcon size={10} />
                      {r.containerNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
  <button
    onClick={() => setViewReport(r)}
    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"
  >
    <Eye size={14} />
  </button>

  <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 text-slate-600">
    {r.reportDate}
  </span>
</div>
            </div>

            {/* AMOUNTS */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 rounded-2xl p-3">
                <p className="text-xs text-slate-400">Grand Total</p>
                <p className="font-bold text-blue-600">
                  {r.currencySymbol || "AED"} {r.grandTotal}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3">
                <p className="text-xs text-slate-400">Final Payable</p>
                <p className="font-bold text-emerald-600">
                  {r.currencySymbol || "AED"} {r.finalPayable}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">

              <button
                onClick={() => downloadPdf(r)}
                className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Download size={14} />
                PDF
              </button>

              <button
                onClick={() => {
                  setSendTarget(r);
                  setPickedFiles([]);
                }}
                className="flex-1 py-2 rounded-2xl text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
              >
                <Mail size={14} />
                Send Mail
              </button>

            </div>
          </div>
        ))}
      </div>

      {viewReport && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
    <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">

      <div
        className="px-5 py-5 text-white rounded-t-3xl"
        style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">
              Report #{viewReport.reportNumber}
            </h3>
            <p className="text-xs text-white/80">
              {viewReport.customerName}
            </p>
          </div>

          <button
            onClick={() => setViewReport(null)}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">

        <div className="bg-slate-50 rounded-2xl p-3">
          <p className="text-xs text-slate-500">Customer</p>
          <p className="font-semibold">
            {viewReport.customerName}
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3">
          <p className="text-xs text-slate-500">Report Number</p>
          <p className="font-semibold">
            {viewReport.reportNumber}
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3">
          <p className="text-xs text-slate-500">Report Date</p>
          <p className="font-semibold">
            {viewReport.reportDate}
          </p>
        </div>

        {viewReport.containerNumber && (
          <div className="bg-slate-50 rounded-2xl p-3">
            <p className="text-xs text-slate-500">Container</p>
            <p className="font-semibold">
              {viewReport.containerNumber}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-2xl p-3">
            <p className="text-xs text-slate-500">Grand Total</p>
            <p className="font-bold text-blue-600">
              {viewReport.currencySymbol || "AED"}{" "}
              {viewReport.grandTotal}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3">
            <p className="text-xs text-slate-500">Final Payable</p>
            <p className="font-bold text-emerald-600">
              {viewReport.currencySymbol || "AED"}{" "}
              {viewReport.finalPayable}
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
)}

      {/* ─────────────── SEND MODAL ─────────────── */}
      {sendTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl">

            <div
              className="px-5 py-5 text-white rounded-t-3xl"
              style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">Send Email</h3>
                  <p className="text-xs text-white/80">
                    #{sendTarget.reportNumber} · {sendTarget.customerName}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">

              {/* FILE PICKER */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip size={16} color={PRIMARY} />
                  <p className="text-sm font-semibold">
                    Attach extra PDFs (optional)
                  </p>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Packing list, BL copy, COO etc. — will be merged into the sales report PDF
                </p>

                <label className="block">
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={onPickFiles}
                    className="hidden"
                  />
                  <div className="cursor-pointer text-center py-3 rounded-xl bg-slate-100 text-sm font-semibold">
                    + Choose PDF files
                  </div>
                </label>

                {pickedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pickedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs bg-white border rounded-xl px-3 py-2"
                      >
                        <span className="truncate flex-1">{f.name}</span>
                        <button
                          onClick={() => removePicked(i)}
                          className="text-red-500 ml-2"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={sendPlain}
                  disabled={sending}
                  className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
                >
                  {sending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Mail size={16} />
                  )}
                  Send (without attachments)
                </button>

                <button
                  onClick={sendWithAttachments}
                  disabled={sending || pickedFiles.length === 0}
                  className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Paperclip size={16} />
                  )}
                  Send + Merged PDFs ({pickedFiles.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
