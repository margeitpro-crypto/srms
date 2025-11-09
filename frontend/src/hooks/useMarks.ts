// FIX: Implemented React Query hooks for managing marks data.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as marksService from '../services/marks';

const MARKS_QUERY_KEY = 'marks';
const SUBJECTS_QUERY_KEY = 'subjects';

export const useSubjects = () => {
    return useQuery({
        queryKey: [SUBJECTS_QUERY_KEY],
        queryFn: marksService.getSubjects,
    });
};

export const useStudentsForMarks = (classId: string, sectionId: string) => {
    return useQuery({
        queryKey: [MARKS_QUERY_KEY, 'students', { classId, sectionId }],
        queryFn: () => marksService.getStudentsForMarksEntry(classId, sectionId),
        enabled: !!classId && !!sectionId,
    });
};

export const useMarks = (classId: string, sectionId: string, subjectId: string) => {
     return useQuery({
        queryKey: [MARKS_QUERY_KEY, { classId, sectionId, subjectId }],
        queryFn: () => marksService.getMarks(classId, sectionId, subjectId),
        enabled: !!classId && !!sectionId && !!subjectId,
     });
};

export const useSaveMarks = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (marks: marksService.Mark[]) => marksService.saveMarks(marks),
        onSuccess: (_, variables) => {
            // Invalidate the query for the specific class/section/subject that was updated
            if (variables.length > 0) {
                 // A real app would get class and section from somewhere too
                 // For now, let's just invalidate all marks queries
                queryClient.invalidateQueries({ queryKey: [MARKS_QUERY_KEY] });
            }
        },
    });
};