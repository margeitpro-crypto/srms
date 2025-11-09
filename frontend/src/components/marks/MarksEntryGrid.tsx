// FIX: Implemented the MarksEntryGrid component for displaying and editing marks.
import React from 'react';
import { Student } from '../../services/students';

interface MarksEntryGridProps {
    students: Student[];
    marksData: Map<string, number | null>;
    onMarksChange: (studentId: string, marks: number | null) => void;
}

const MarksEntryGrid: React.FC<MarksEntryGridProps> = ({ students, marksData, onMarksChange }) => {

    const handleInputChange = (studentId: string, value: string) => {
        if (value === '') {
            onMarksChange(studentId, null);
            return;
        }
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            onMarksChange(studentId, numValue);
        }
    };

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Roll No</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Marks (out of 100)</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {students.length > 0 ? students.map((student) => (
                        <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.roll_no}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.first_name} {student.last_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={marksData.get(student.id) ?? ''}
                                    onChange={(e) => handleInputChange(student.id, e.target.value)}
                                    className="w-24 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                                />
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No students found for this class and section.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MarksEntryGrid;