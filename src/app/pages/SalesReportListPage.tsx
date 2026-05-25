import { useEffect, useState } from "react";
import { salesReportService, SalesReport } from "../../services/salesReportService";
import { FileText, Mail, Download, Loader2, Receipt } from "lucide-react";

const PRIMARY = "#008d5b";

const SalesReportsPage = () => {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [loading, setLoading] = useState(true);

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

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* HEADER (CompaniesPage style) */}
      <div
        className="px-5 pt-6 pb-8 rounded-b-[28px] text-white"
        style={{ background: PRIMARY }}
      >
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        <p className="text-white/80 text-sm mt-1">
          Total Reports: {reports.length}
        </p>
      </div>

      {/* LIST */}
      <div className="p-4 space-y-4">

        {reports.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <Receipt className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500 text-sm">
              No Sales Reports Found
            </p>
          </div>
        )}

        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
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

                  <p className="text-xs text-slate-400 mt-1">
                    {r.customerName}
                  </p>
                </div>

              </div>

              <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {r.reportDate}
              </span>

            </div>

            {/* AMOUNT SECTION */}
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
                onClick={() => salesReportService.downloadPdf(r.id)}
                className="flex-1 py-2 rounded-2xl bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Download size={14} />
                PDF
              </button>

              <button
                onClick={() => salesReportService.sendMail(r.id)}
                className="flex-1 py-2 rounded-2xl text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                style={{ background: PRIMARY }}
              >
                <Mail size={14} />
                Send Mail
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default SalesReportsPage;