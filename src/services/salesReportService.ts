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

    const res =
      await api.get<ApiResponse<SalesReport[]>>(
        "/api/sales-reports"
      );

    return res.data.data;
  },

  // =========================================
  // GET SINGLE REPORT DETAILS
  // =========================================

  getDetails: async (id: number) => {

    const res =
      await api.get<ApiResponse<SalesReport>>(
        `/api/sales-reports/${id}/details`
      );

    return res.data.data;
  },

  // =========================================
  // DOWNLOAD PDF
  // =========================================

  downloadPdf: async (id: number) => {

    try {

      const response =
        await api.get(
          `/api/pdf/sales-report/${id}`,
          {
            responseType: "blob",
          }
        );

      const file =
        new Blob(
          [response.data],
          { type: "application/pdf" }
        );

      const fileURL =
        URL.createObjectURL(file);

      window.open(fileURL);

    } catch (error) {

      console.error(
        "PDF Download Error:",
        error
      );
    }
  },

  // =========================================
  // SEND EMAIL
  // =========================================

  sendMail: async (id: number) => {

    return await api.post(
      `/api/sales-reports/${id}/send-mail`
    );
  }
};