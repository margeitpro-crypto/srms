import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic request handler
const request = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    throw {
      message: error.response?.data?.error || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};

// API methods
const apiService = {
  // Auth endpoints
  login: (credentials) => request('POST', '/auth/login', credentials),
  register: (userData) => request('POST', '/auth/register', userData),
  getProfile: () => request('GET', '/auth/profile'),
  updateProfile: (userData) => request('PUT', '/auth/profile', userData),
  changePassword: (passwordData) => request('PUT', '/auth/change-password', passwordData),
  forgotPassword: (email) => request('POST', '/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => request('POST', '/auth/reset-password', { token, newPassword }),

  // Student endpoints
  getStudents: (params) => request('GET', '/students', null, { params }),
  getStudentById: (id) => request('GET', `/students/${id}`),
  createStudent: (studentData) => request('POST', '/students', studentData),
  updateStudent: (id, studentData) => request('PUT', `/students/${id}`, studentData),
  deleteStudent: (id) => request('DELETE', `/students/${id}`),
  getStudentsByClass: (params) => request('GET', '/students/by-class', null, { params }),

  // Teacher endpoints
  getTeachers: (params) => request('GET', '/teachers', null, { params }),
  getTeacherById: (id) => request('GET', `/teachers/${id}`),
  createTeacher: (teacherData) => request('POST', '/teachers', teacherData),
  updateTeacher: (id, teacherData) => request('PUT', `/teachers/${id}`, teacherData),
  deleteTeacher: (id) => request('DELETE', `/teachers/${id}`),

  // User endpoints
  getUsers: (params) => request('GET', '/users', null, { params }),
  getUserById: (id) => request('GET', `/users/${id}`),
  createUser: (userData) => request('POST', '/users', userData),
  updateUser: (id, userData) => request('PUT', `/users/${id}`, userData),
  deleteUser: (id) => request('DELETE', `/users/${id}`),

  // School endpoints
  getSchools: (params) => request('GET', '/schools', null, { params }),
  getSchoolById: (id) => request('GET', `/schools/${id}`),
  getMySchool: () => request('GET', '/schools/my-school'),
  createSchool: (schoolData) => request('POST', '/schools', schoolData),
  updateSchool: (id, schoolData) => request('PUT', `/schools/${id}`, schoolData),
  deleteSchool: (id) => request('DELETE', `/schools/${id}`),

  // Subject endpoints
  getSubjects: (params) => request('GET', '/subjects', null, { params }),
  getSubjectById: (id) => request('GET', `/subjects/${id}`),
  createSubject: (subjectData) => request('POST', '/subjects', subjectData),
  updateSubject: (id, subjectData) => request('PUT', `/subjects/${id}`, subjectData),
  deleteSubject: (id) => request('DELETE', `/subjects/${id}`),

  // Marks endpoints
  getMarks: (params) => request('GET', '/marks', null, { params }),
  getMarkById: (id) => request('GET', `/marks/${id}`),
  createMark: (markData) => request('POST', '/marks', markData),
  updateMark: (id, markData) => request('PUT', `/marks/${id}`, markData),
  deleteMark: (id) => request('DELETE', `/marks/${id}`),
  getStudentReport: (studentId) => request('GET', `/marks/student/${studentId}`),

  // Exam endpoints
  getExams: (params) => request('GET', '/exams', null, { params }),
  getExamById: (id) => request('GET', `/exams/${id}`),
  createExam: (examData) => request('POST', '/exams', examData),
  updateExam: (id, examData) => request('PUT', `/exams/${id}`, examData),
  deleteExam: (id) => request('DELETE', `/exams/${id}`),

  // Reports endpoints
  getReports: (params) => request('GET', '/reports', null, { params }),
};

export default apiService;
