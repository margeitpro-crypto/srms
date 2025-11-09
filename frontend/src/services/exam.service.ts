import apiService from './api.service';

export interface Exam {
  id: number;
  name: string;
  code: string;
  description?: string;
  examType: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPublished: boolean;
  schoolId?: number;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: number;
    name: string;
    code: string;
  };
  subjects?: ExamSubject[];
  _count?: {
    results: number;
  };
}

export interface ExamSubject {
  id: number;
  maxMarks: number;
  minMarks: number;
  examDate?: string;
  duration?: number;
  instructions?: string;
  subject: {
    id: number;
    name: string;
    code: string;
  };
}

export interface ExamFormData {
  name: string;
  code: string;
  description?: string;
  examType: string;
  startDate: string;
  endDate: string;
  schoolId?: number;
  subjects?: ExamSubjectInput[];
}

export interface ExamSubjectInput {
  subjectId: number;
  maxMarks?: number;
  minMarks?: number;
  examDate?: string;
  duration?: number;
  instructions?: string;
}

export interface ExamResult {
  id: number;
  status: string;
  totalMarks?: number;
  obtainedMarks?: number;
  percentage?: number;
  grade?: string;
  gradePoints?: number;
  rank?: number;
  remarks?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  examId: number;
  studentId: number;
  student: {
    id: number;
    name: string;
    rollNo: string;
    class: string;
    section: string;
  };
  subjectResults: ExamSubjectResult[];
}

export interface ExamSubjectResult {
  id: number;
  marks: number;
  maxMarks: number;
  grade?: string;
  gradePoints?: number;
  isAbsent: boolean;
  remarks?: string;
  examResultId: number;
  subjectId: number;
  subject: {
    id: number;
    name: string;
    code: string;
  };
}

export interface PaginatedExams {
  exams: Exam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedExamResults {
  results: ExamResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ExamService {
  /**
   * Get all exams with filtering and pagination
   */
  async getAllExams(
    filters: {
      page?: number;
      limit?: number;
      schoolId?: number;
      examType?: string;
      status?: string;
      search?: string;
    } = {}
  ): Promise<PaginatedExams> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.schoolId) params.append('schoolId', filters.schoolId.toString());
    if (filters.examType) params.append('examType', filters.examType);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiService.get(`/exams?${params.toString()}`);
    return response.data;
  }

  /**
   * Get exam by ID
   */
  async getExamById(id: number): Promise<Exam> {
    const response = await apiService.get(`/exams/${id}`);
    return response.data.exam;
  }

  /**
   * Create a new exam
   */
  async createExam(examData: ExamFormData): Promise<Exam> {
    const response = await apiService.post('/exams', examData);
    return response.data.exam;
  }

  /**
   * Update exam information
   */
  async updateExam(id: number, examData: Partial<ExamFormData>): Promise<Exam> {
    const response = await apiService.put(`/exams/${id}`, examData);
    return response.data.exam;
  }

  /**
   * Delete an exam
   */
  async deleteExam(id: number): Promise<void> {
    await apiService.delete(`/exams/${id}`);
  }

  /**
   * Publish an exam
   */
  async publishExam(id: number): Promise<Exam> {
    const response = await apiService.post(`/exams/${id}/publish`);
    return response.data.exam;
  }

  /**
   * Get exam results
   */
  async getExamResults(
    examId: number,
    filters: {
      page?: number;
      limit?: number;
      status?: string;
      class?: string;
      section?: string;
    } = {}
  ): Promise<PaginatedExamResults> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.class) params.append('class', filters.class);
    if (filters.section) params.append('section', filters.section);
    
    const response = await apiService.get(`/exams/${examId}/results?${params.toString()}`);
    return response.data;
  }

  /**
   * Process exam results
   */
  async processExamResults(examId: number, results: any[]): Promise<{ processedCount: number }> {
    const response = await apiService.post(`/exams/${examId}/results/process`, { results });
    return response.data;
  }

  /**
   * Publish exam results
   */
  async publishResults(examId: number, studentIds?: number[]): Promise<{ publishedCount: number }> {
    const data: any = {};
    if (studentIds && studentIds.length > 0) {
      data.studentIds = studentIds;
    }
    
    const response = await apiService.post(`/exams/${examId}/results/publish`, data);
    return response.data;
  }
}

export default new ExamService();