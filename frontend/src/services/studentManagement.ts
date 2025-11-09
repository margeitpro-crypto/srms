import apiService from './api.service';

export interface Student {
  id: number;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  schoolId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentFormData {
  name: string;
  rollNo: string;
  class: string;
  section: string;
  schoolId: number;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
}

export interface PaginatedStudents {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ClassStudents {
  id: number;
  name: string;
  rollNo: string;
  class: string;
  section: string;
}

class StudentManagementService {
  /**
   * Get all students with filtering and pagination
   */
  async getAllStudents(
    filters: {
      class?: string;
      section?: string;
      schoolId?: number;
      search?: string;
    } = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedStudents> {
    const params = new URLSearchParams();
    
    if (filters.class) params.append('class', filters.class);
    if (filters.section) params.append('section', filters.section);
    if (filters.schoolId) params.append('schoolId', filters.schoolId.toString());
    if (filters.search) params.append('search', filters.search);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await apiService.get(`/students?${params.toString()}`);
    return response.data;
  }

  /**
   * Get student by ID
   */
  async getStudentById(id: number): Promise<Student> {
    const response = await apiService.get(`/students/${id}`);
    return response.data.student;
  }

  /**
   * Create a new student
   */
  async createStudent(studentData: StudentFormData): Promise<Student> {
    const response = await apiService.post('/students', studentData);
    return response.data.student;
  }

  /**
   * Update student information
   */
  async updateStudent(id: number, studentData: Partial<StudentFormData>): Promise<Student> {
    const response = await apiService.put(`/students/${id}`, studentData);
    return response.data.student;
  }

  /**
   * Delete a student
   */
  async deleteStudent(id: number): Promise<void> {
    await apiService.delete(`/students/${id}`);
  }

  /**
   * Get students by class
   */
  async getStudentsByClass(
    className: string,
    section?: string,
    schoolId?: number
  ): Promise<ClassStudents[]> {
    const params = new URLSearchParams();
    params.append('class', className);
    if (section) params.append('section', section);
    if (schoolId) params.append('schoolId', schoolId.toString());
    
    const response = await apiService.get(`/students/by-class?${params.toString()}`);
    return response.data.students;
  }

  /**
   * Check if a roll number is available
   */
  async isRollNoAvailable(
    rollNo: string,
    className: string,
    section: string,
    schoolId: number,
    excludeId?: number
  ): Promise<boolean> {
    try {
      // This would be implemented as a custom endpoint or validation on the backend
      // For now, we'll implement a simple check by trying to get students with this roll number
      const students = await this.getStudentsByClass(className, section, schoolId);
      const existingStudent = students.find(
        student => student.rollNo === rollNo && student.id !== excludeId
      );
      return !existingStudent;
    } catch (error) {
      console.error('Error checking roll number availability:', error);
      return true; // Assume available if there's an error
    }
  }
}

export default new StudentManagementService();