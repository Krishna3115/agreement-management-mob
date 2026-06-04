import api from "./api";

export interface SalesReport {
  id: number;
  reportNumber: string;
  reportDate: string;
  customerName: string;
  procurementType: string;
  taxMode: string;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  expenseTotal: number;
  finalPayable: number;
  containerNumber?: string;
  currency?: string;
  currencySymbol?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const salesReportService = {

  // =========================================
  // GET ALL SALES REPORTS
  // =========================================
  getAll: async (): Promise<SalesReport[]> => {
    const res = await api.get<ApiResponse<SalesReport[]>>(
      "/api/sales-reports"
    );
    return res.data.data;
  },

  // =========================================
  // GET SINGLE REPORT DETAILS
  // =========================================
  getDetails: async (id: number) => {
    const res = await api.get<ApiResponse<any>>(
      `/api/sales-reports/${id}/details`
    );
    return res.data.data;
  },

  // =========================================
  // CREATE
  // =========================================
  create: async (payload: any) => {
    const res = await api.post<ApiResponse<SalesReport>>(
      "/api/sales-reports",
      payload
    );
    return res.data.data;
  },

  // =========================================
  // SEND EMAIL (no attachments)
  // =========================================
  sendMail: async (id: number) => {
    return await api.post(
      `/api/sales-reports/${id}/send-mail`
    );
  },

  downloadPdf: async (id: number) => {

  const response = await api.get(
    `/api/sales-reports/${id}/download-pdf`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob(
    [response.data],
    { type: "application/pdf" }
  );

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `sales-report-${id}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
},
  // =========================================
  // SEND EMAIL WITH PDF ATTACHMENTS
  // Backend merges them into one PDF before sending.
  // =========================================
  sendMailWithAttachments: async (id: number, files: File[]) => {

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("attachments", file);
    });

    return await api.post(
      `/api/sales-reports/${id}/send-mail-with-attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};