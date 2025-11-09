import { PaginatedResponse } from "./schools";

export interface Student {
    id: string;
    roll_no: string;
    first_name: string;
    last_name: string;
    dob: string; // YYYY-MM-DD
    gender: 'Male' | 'Female' | 'Other';
    class: string;
    section: string;
}

const allStudents: Student[] = Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    roll_no: `S${1001 + i}`,
    first_name: `StudentFirst${i + 1}`,
    last_name: `StudentLast${i + 1}`,
    dob: `${2005 + Math.floor(i/10)}-${String(i%12 + 1).padStart(2,'0')}-15`,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    class: '10',
    section: i % 3 === 0 ? 'A' : (i % 3 === 1 ? 'B' : 'C'),
}));

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getStudents = async (page = 1, limit = 10, query = ''): Promise<PaginatedResponse<Student>> => {
    await delay(500);
    const filtered = allStudents.filter(student =>
        student.first_name.toLowerCase().includes(query.toLowerCase()) ||
        student.last_name.toLowerCase().includes(query.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(query.toLowerCase())
    );
    const paginatedData = filtered.slice((page - 1) * limit, page * limit);
    return {
        data: paginatedData,
        total: filtered.length,
        page,
        limit,
    };
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
    await delay(300);
    return allStudents.find(s => s.id === id);
};

export const createStudent = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    await delay(700);
    if (allStudents.some(s => s.roll_no === studentData.roll_no)) {
        throw new Error(`A student with roll number ${studentData.roll_no} already exists.`);
    }
    const newStudent: Student = {
        ...studentData,
        id: String(allStudents.length + 1 + Math.random()),
    };
    allStudents.unshift(newStudent);
    return newStudent;
};

export const bulkCreateStudents = async (studentsData: Omit<Student, 'id'>[]): Promise<{ success: number; failed: number; errors: string[] }> => {
    await delay(1500);
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    studentsData.forEach(studentData => {
        if (allStudents.some(s => s.roll_no === studentData.roll_no)) {
            failed++;
            errors.push(`Roll number ${studentData.roll_no} already exists.`);
        } else {
            const newStudent: Student = { ...studentData, id: String(allStudents.length + 1 + Math.random()) };
            allStudents.unshift(newStudent);
            success++;
        }
    });
    
    return { success, failed, errors };
};


export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
    await delay(700);
    const studentIndex = allStudents.findIndex(s => s.id === id);
    if (studentIndex === -1) throw new Error('Student not found');
    
    // Check for roll_no uniqueness if it's being updated
    if (updates.roll_no && allStudents.some(s => s.roll_no === updates.roll_no && s.id !== id)) {
        throw new Error(`A student with roll number ${updates.roll_no} already exists.`);
    }

    allStudents[studentIndex] = { ...allStudents[studentIndex], ...updates };
    return allStudents[studentIndex];
};

export const deleteStudent = async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    const studentIndex = allStudents.findIndex(s => s.id === id);
    if (studentIndex === -1) throw new Error('Student not found');
    
    allStudents.splice(studentIndex, 1);
    return { success: true };
};