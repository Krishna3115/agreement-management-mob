import api from "./api";

export interface PurchaseOrderItem {
  commodity: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber?: string;
  poDate?: string;
  exporterId?: number;
  companyName?: string;
  countryOfOrigin?: string;
  destinationPort?: string;
  incoterms?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  qualityStandard?: string;
  transportMode?: string;
  grandTotal?: number;
  status?: string;
  items?: PurchaseOrderItem[];
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export const purchaseOrderService = {

  getAll: async (): Promise<PurchaseOrder[]> => {
    const res = await api.get("/api/purchase-orders");
    const payload = res.data?.data ?? res.data ?? [];
    return Array.isArray(payload) ? payload : [];
  },

  getById: async (id: number): Promise<PurchaseOrder> => {
    const res = await api.get<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${id}`
    );
    return res.data?.data ?? (res.data as any);
  },

  create: async (payload: any) => {
    const res = await api.post("/api/purchase-orders", payload);
    return res.data?.data ?? res.data;
  },

  // Send PO PDF (with letterhead) to the exporter via email
  sendMail: async (id: number) => {
    return await api.post(
      `/api/purchase-orders/${id}/send-mail`
    );
  },
};