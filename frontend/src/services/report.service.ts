import apiService from './api.service';

export interface StudentReport {
  student: {
    id: number;
    name: string;
    rollNo: string;
    class: string;
    section: string;
    school: {
      id: number;
      name: string;
      code: string;
    };
  };
  marks: {
    id: number;
    marks: number;
    maxMarks: number;
    grade: string;
    subject: {
      id: number;
      name: string;
      code: string;
    };
  }[];
  summary: {
    totalSubjects: number;
    totalMarks: number;
    averageMarks: number;
    overallGrade: string;
    gpa: number;
  };
}

export interface ClassReport {
  class: string;
  section: string;
  totalStudents: number;
  averageMarks: number;
  subjectAverages: {
    subjectId: number;
    subjectName: string;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
  }[];
  topPerformers: {
    studentId: number;
    studentName: string;
    rollNo: string;
    totalMarks: number;
    percentage: number;
    grade: string;
  }[];
}

export interface SchoolReport {
  school: {
    id: number;
    name: string;
    code: string;
  };
  academicYear: string;
  totalStudents: number;
  totalClasses: number;
  overallAverage: number;
  classAverages: {
    class: string;
    averageMarks: number;
    studentCount: number;
  }[];
  subjectPerformance: {
    subjectId: number;
    subjectName: string;
    averageMarks: number;
    passRate: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
  }[];
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'xlsx';
  includeCharts?: boolean;
  includeDetailedData?: boolean;
}

class ReportService {
  /**
   * Get student report
   */
  async getStudentReport(studentId: number): Promise<StudentReport> {
    const response = await apiService.get(`/marks/student/${studentId}`);
    return response.data;
  }

  /**
   * Get class report
   */
  async getClassReport(classId: string, section: string, filters: {
    examId?: number;
    subjectId?: number;
  } = {}): Promise<ClassReport> {
    const params = new URLSearchParams();
    params.append('class', classId);
    params.append('section', section);
    
    if (filters.examId) params.append('examId', filters.examId.toString());
    if (filters.subjectId) params.append('subjectId', filters.subjectId.toString());
    
    const response = await apiService.get(`/reports/class?${params.toString()}`);
    return response.data;
  }

  /**
   * Get school report
   */
  async getSchoolReport(schoolId: number, filters: {
    academicYear?: string;
    examId?: number;
  } = {}): Promise<SchoolReport> {
    const params = new URLSearchParams();
    params.append('schoolId', schoolId.toString());
    
    if (filters.academicYear) params.append('academicYear', filters.academicYear);
    if (filters.examId) params.append('examId', filters.examId.toString());
    
    const response = await apiService.get(`/reports/school?${params.toString()}`);
    return response.data;
  }

  /**
   * Export report
   */
  async exportReport(reportType: string, filters: any, options: ExportOptions): Promise<Blob> {
    const params = new URLSearchParams();
    
    // Add filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params.append(key, filters[key].toString());
      }
    });
    
    // Add export options
    params.append('format', options.format);
    if (options.includeCharts) params.append('includeCharts', 'true');
    if (options.includeDetailedData) params.append('includeDetailedData', 'true');
    
    const response = await apiService.get(`/reports/${reportType}/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    return response.data;
  }

  /**
   * Get trend analysis
   */
  async getTrendAnalysis(studentId: number, filters: {
    months?: number;
    subjectId?: number;
  } = {}): Promise<any> {
    const params = new URLSearchParams();
    params.append('studentId', studentId.toString());
    
    if (filters.months) params.append('months', filters.months.toString());
    if (filters.subjectId) params.append('subjectId', filters.subjectId.toString());
    
    const response = await apiService.get(`/reports/trends?${params.toString()}`);
    return response.data;
  }
}

export default new ReportService();