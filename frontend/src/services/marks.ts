// FIX: Implemented a mock service for fetching and saving marks data.
import { Student } from "./students";

export interface Subject {
    id: string;
    name: string;
}

export interface Mark {
    studentId: string;
    subjectId: string;
    marks: number | null; // null if not entered
}

// Mock data
const subjects: Subject[] = [
    { id: 'sub1', name: 'Mathematics' },
    { id: 'sub2', name: 'Science' },
    { id: 'sub3', name: 'History' },
    { id: 'sub4', name: 'English' },
];

let allMarks: Mark[] = [
    // Pre-populate some marks for demonstration
    { studentId: '1', subjectId: 'sub1', marks: 85 },
    { studentId: '1', subjectId: 'sub2', marks: 92 },
    { studentId: '2', subjectId: 'sub1', marks: 78 },
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getSubjects = async (): Promise<Subject[]> => {
    await delay(200);
    return subjects;
};

// In a real app, you would fetch students based on class and section.
// Here we just return all students for simplicity.
export const getStudentsForMarksEntry = async (classId: string, sectionId: string): Promise<Student[]> => {
    await delay(500);
    // This is a mock. A real implementation would filter students by class & section.
    // For now, we'll just return the first 15 students.
    const { getStudents } = await import('./students');
    const studentResponse = await getStudents(1, 15);
    console.log(`Fetching students for class ${classId}, section ${sectionId}`);
    return studentResponse.data;
};

export const getMarks = async (classId: string, sectionId:string, subjectId: string): Promise<Mark[]> => {
    await delay(400);
    console.log(`Fetching marks for class ${classId}, section ${sectionId}, subject ${subjectId}`);
    // This is a mock. We just filter by subjectId.
    return allMarks.filter(m => m.subjectId === subjectId);
};

export const saveMarks = async (marksToSave: Mark[]): Promise<{ success: boolean, saved: number }> => {
    await delay(800);
    marksToSave.forEach(newMark => {
        const index = allMarks.findIndex(m => m.studentId === newMark.studentId && m.subjectId === newMark.subjectId);
        if (index !== -1) {
            allMarks[index] = newMark; // Update
        } else {
            allMarks.push(newMark); // Insert
        }
    });
    return { success: true, saved: marksToSave.length };
}