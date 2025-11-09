import apiService from './api.service';

export interface Bill {
  id: number;
  billNo: string;
  studentId: number;
  amount: number;
  dueDate: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  student: {
    id: number;
    name: string;
    rollNo: string;
    class: string;
    section: string;
  };
}

export interface Payment {
  id: number;
  billId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  receiptNo: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  bill: Bill;
}

export interface BillingSummary {
  totalBills: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  billsByStatus: {
    PENDING: number;
    PAID: number;
    OVERDUE: number;
    CANCELLED: number;
  };
}

export interface PaginatedBills {
  bills: Bill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedPayments {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BillFormData {
  studentId: number;
  amount: number;
  dueDate: string;
  description?: string;
}

class BillingService {
  /**
   * Get billing summary
   */
  async getBillingSummary(): Promise<BillingSummary> {
    const response = await apiService.get('/billing/summary');
    return response.data;
  }

  /**
   * Get all bills with filtering and pagination
   */
  async getAllBills(
    filters: {
      page?: number;
      limit?: number;
      studentId?: number;
      status?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<PaginatedBills> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.studentId) params.append('studentId', filters.studentId.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await apiService.get(`/billing/bills?${params.toString()}`);
    return response.data;
  }

  /**
   * Get bill by ID
   */
  async getBillById(id: number): Promise<Bill> {
    const response = await apiService.get(`/billing/bills/${id}`);
    return response.data.bill;
  }

  /**
   * Create a new bill
   */
  async createBill(billData: BillFormData): Promise<Bill> {
    const response = await apiService.post('/billing/bills', billData);
    return response.data.bill;
  }

  /**
   * Update bill information
   */
  async updateBill(id: number, billData: Partial<BillFormData>): Promise<Bill> {
    const response = await apiService.put(`/billing/bills/${id}`, billData);
    return response.data.bill;
  }

  /**
   * Delete a bill
   */
  async deleteBill(id: number): Promise<void> {
    await apiService.delete(`/billing/bills/${id}`);
  }

  /**
   * Process payment for a bill
   */
  async processPayment(billId: number, paymentData: {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    notes?: string;
  }): Promise<Payment> {
    const response = await apiService.post(`/billing/bills/${billId}/pay`, paymentData);
    return response.data.payment;
  }

  /**
   * Get all payments with filtering and pagination
   */
  async getAllPayments(
    filters: {
      page?: number;
      limit?: number;
      billId?: number;
      studentId?: number;
      status?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<PaginatedPayments> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.billId) params.append('billId', filters.billId.toString());
    if (filters.studentId) params.append('studentId', filters.studentId.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await apiService.get(`/billing/payments?${params.toString()}`);
    return response.data;
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id: number): Promise<Payment> {
    const response = await apiService.get(`/billing/payments/${id}`);
    return response.data.payment;
  }

  /**
   * Generate receipt for payment
   */
  async generateReceipt(paymentId: number): Promise<Blob> {
    const response = await apiService.get(`/billing/payments/${paymentId}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Export billing data
   */
  async exportBillingData(filters: any, format: 'pdf' | 'csv' | 'xlsx'): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params.append(key, filters[key].toString());
      }
    });
    
    params.append('format', format);
    
    const response = await apiService.get(`/billing/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    return response.data;
  }
}

export default new BillingService();