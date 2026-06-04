import api from "./api";

// ---------- Salespeople (owner) ----------
export const salespersonApi = {
  create: (username: string, password: string) =>
    api.post("/api/salespeople", { username, password }),
  list: () => api.get("/api/salespeople").then(r => r.data),
};

// ---------- Containers / stock ----------
export interface StockLine {
  productName: string;
  receivedQty: number;
  receivedValue?: number;
}
export const containerApi = {
  add: (payload: {
    containerNo: string;
    receivedDate?: string;
    notes?: string;
    stocks: StockLine[];
  }) => api.post("/api/field/containers", payload).then(r => r.data),

  all: () => api.get("/api/field/containers").then(r => r.data),
  one: (id: number) => api.get(`/api/field/containers/${id}`).then(r => r.data),
};

// ---------- Buyers ----------
export const buyerApi = {
  add: (payload: {
    name: string; companyName?: string; mobile?: string;
    email?: string; address?: string;
  }) => api.post("/api/field/buyers", payload).then(r => r.data),
  all: () => api.get("/api/field/buyers").then(r => r.data),

  // NEW: pending balance summary for one buyer
  pending: (buyerId: number) =>
    api.get(`/api/field/buyers/${buyerId}/pending`).then(r => r.data),
};

// ---------- Invoices ----------
export interface InvoiceLine {
  stockId: number;
  quantity: number;
  ratePerBox: number;
}
export const fieldInvoiceApi = {
  create: (payload: {
    buyerId: number;
    vatMode: "WITH_VAT" | "WITHOUT_VAT";
    paymentMode: "CASH" | "CREDIT" | "HALF_CASH_HALF_CREDIT";
    cashPortion?: number;
    items: InvoiceLine[];
  }) => api.post("/api/field/invoices", payload).then(r => r.data),

  mine: () => api.get("/api/field/invoices/mine").then(r => r.data),
  today: () => api.get("/api/field/invoices/today").then(r => r.data),

  // NEW: full history + period range + self summary
  history: () => api.get("/api/field/invoices/history").then(r => r.data),
  range: (period: "today" | "week" | "month") =>
    api.get("/api/field/invoices/range", { params: { period } }).then(r => r.data),
  mySummary: (period: "today" | "week" | "month") =>
    api.get("/api/field/invoices/my-summary", { params: { period } }).then(r => r.data),

  one: (id: number) => api.get(`/api/field/invoices/${id}`).then(r => r.data),
  sendMail: (id: number) => api.post(`/api/field/invoices/${id}/send-mail`),

  downloadPdf: async (id: number) => {
    const res = await api.get(`/api/field/invoices/${id}/pdf`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

// ---------- Payments ----------
export const paymentApi = {
  collect: (payload: {
    buyerId: number;
    invoiceId?: number;
    amount: number;
    paymentType: "FULL" | "PARTIAL";
    method: "CASH" | "NETBANKING";
    referenceId?: string;
  }) => api.post("/api/field/payments/collect", payload).then(r => r.data),
  today: () => api.get("/api/field/payments/today").then(r => r.data),
};

// ---------- Expenses ----------
export const expenseApi = {
  add: (payload: { description: string; amount: number }) =>
    api.post("/api/field/expenses", payload).then(r => r.data),
  today: () => api.get("/api/field/expenses/today").then(r => r.data),
  all: () => api.get("/api/field/expenses/all").then(r => r.data),

  // NEW: period range
  range: (period: "today" | "week" | "month") =>
    api.get("/api/field/expenses/range", { params: { period } }).then(r => r.data),
};

// ---------- Owner reports ----------
export const reportApi = {
  salespeople: (date?: string) =>
    api.get("/api/field/reports/salespeople", { params: date ? { date } : {} })
      .then(r => r.data),

  // NEW: period-based per-salesperson summary
  salespeopleRange: (period: "today" | "week" | "month") =>
    api.get("/api/field/reports/salespeople-range", { params: { period } })
      .then(r => r.data),

  containers: () => api.get("/api/field/reports/containers").then(r => r.data),
};

export const settlementApi = {
  // expected = what the salesperson collected that day (prefill)
  expected: (salesperson: string, date?: string) =>
    api.get("/api/field/settlements/expected", {
      params: { salesperson, ...(date ? { date } : {}) },
    }).then(r => r.data),

  record: (payload: {
    salesperson: string;
    date?: string;
    submittedAmount: number;
    note?: string;
  }) => api.post("/api/field/settlements", payload).then(r => r.data),

  all: () => api.get("/api/field/settlements").then(r => r.data),
  bySalesperson: (salesperson: string) =>
    api.get("/api/field/settlements/by-salesperson", { params: { salesperson } })
      .then(r => r.data),
};

export const containerExpenseApi = {
  add: (payload: { containerId: number; description: string; amount: number }) =>
    api.post("/api/field/container-expenses", payload).then(r => r.data),
  forContainer: (containerId: number) =>
    api.get(`/api/field/container-expenses/container/${containerId}`).then(r => r.data),
  all: () => api.get("/api/field/container-expenses").then(r => r.data),
};

export const containerDocApi = {
  upload: (containerId: number, docName: string, file: File) => {
    const fd = new FormData();
    fd.append("containerId", String(containerId));
    fd.append("docName", docName);
    fd.append("file", file);
    return api.post("/api/field/container-docs", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(r => r.data);
  },
  list: (containerId: number) =>
    api.get(`/api/field/container-docs/container/${containerId}`).then(r => r.data),
  open: async (docId: number) => {
    const res = await api.get(`/api/field/container-docs/${docId}/download`, {
      responseType: "blob",
    });
    // Use the content-type the server sent (e.g. application/pdf) so the
    // browser RENDERS the file instead of showing raw %PDF bytes.
    const contentType =
      res.headers?.["content-type"] || res.data?.type || "application/pdf";
    const blob = new Blob([res.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  },
  remove: (docId: number) =>
    api.delete(`/api/field/container-docs/${docId}`).then(r => r.data),
};

export const ownerExtraApi = {
  allExpenses: () => api.get("/api/field/reports/expenses-all").then(r => r.data),
  salespersonDetail: (username: string) =>
    api.get(`/api/field/reports/salesperson/${username}`).then(r => r.data),
};