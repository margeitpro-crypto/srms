import apiService from './api.service';

export interface Certificate {
  id: number;
  certificateNo: string;
  type: string;
  title: string;
  description?: string;
  issueDate: string;
  validUntil?: string;
  verificationCode: string;
  status: string;
  templateData?: any;
  pdfPath?: string;
  downloadCount: number;
  lastDownloaded?: string;
  createdAt: string;
  updatedAt: string;
  studentId: number;
  examResultId?: number;
  templateId?: number;
  issuedById?: number;
  student: {
    id: number;
    name: string;
    rollNo: string;
    class: string;
    section: string;
  };
}

export interface CertificateTemplate {
  id: number;
  name: string;
  type: string;
  template: any;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateFormData {
  studentId: number;
  type: string;
  title: string;
  description?: string;
  templateId?: number;
  examResultId?: number;
}

export interface PaginatedCertificates {
  certificates: Certificate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  message: string;
}

class CertificateService {
  /**
   * Get all certificates with filtering and pagination
   */
  async getAllCertificates(
    filters: {
      page?: number;
      limit?: number;
      studentId?: number;
      type?: string;
      status?: string;
      search?: string;
    } = {}
  ): Promise<PaginatedCertificates> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.studentId) params.append('studentId', filters.studentId.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiService.get(`/certificates?${params.toString()}`);
    return response.data;
  }

  /**
   * Get certificate by ID
   */
  async getCertificateById(id: number): Promise<Certificate> {
    const response = await apiService.get(`/certificates/${id}`);
    return response.data.certificate;
  }

  /**
   * Create a new certificate
   */
  async createCertificate(certificateData: CertificateFormData): Promise<Certificate> {
    const response = await apiService.post('/certificates', certificateData);
    return response.data.certificate;
  }

  /**
   * Update certificate information
   */
  async updateCertificate(id: number, certificateData: Partial<CertificateFormData>): Promise<Certificate> {
    const response = await apiService.put(`/certificates/${id}`, certificateData);
    return response.data.certificate;
  }

  /**
   * Delete a certificate
   */
  async deleteCertificate(id: number): Promise<void> {
    await apiService.delete(`/certificates/${id}`);
  }

  /**
   * Get certificate templates
   */
  async getCertificateTemplates(): Promise<CertificateTemplate[]> {
    const response = await apiService.get('/certificates/templates');
    return response.data.templates;
  }

  /**
   * Verify certificate
   */
  async verifyCertificate(verificationCode: string): Promise<VerificationResult> {
    const response = await apiService.get(`/certificates/verify/${verificationCode}`);
    return response.data;
  }

  /**
   * Download certificate
   */
  async downloadCertificate(id: number): Promise<Blob> {
    const response = await apiService.get(`/certificates/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Generate certificates in bulk
   */
  async generateBulkCertificates(studentIds: number[], type: string): Promise<{ generated: number; failed: number }> {
    const response = await apiService.post('/certificates/bulk', { studentIds, type });
    return response.data;
  }
}

export default new CertificateService();