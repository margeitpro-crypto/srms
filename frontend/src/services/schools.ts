export interface School {
    id: string;
    name: string;
    address: string;
    principal: string;
    students: number;
    established: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

const allSchools: School[] = Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 1}`,
    name: `School #${i + 1}`,
    address: `${i + 1} Learning Lane, Knowledge City`,
    principal: `Dr. Eleanor Vance ${i + 1}`,
    students: Math.floor(Math.random() * 500) + 100,
    established: 2000 + i,
}));

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getSchools = async (page = 1, limit = 10, query = ''): Promise<PaginatedResponse<School>> => {
    await delay(500);
    const filteredSchools = allSchools.filter(school =>
        school.name.toLowerCase().includes(query.toLowerCase()) ||
        school.principal.toLowerCase().includes(query.toLowerCase())
    );
    const paginatedData = filteredSchools.slice((page - 1) * limit, page * limit);
    return {
        data: paginatedData,
        total: filteredSchools.length,
        page,
        limit,
    };
};

export const getSchoolById = async (id: string): Promise<School | undefined> => {
    await delay(300);
    return allSchools.find(school => school.id === id);
};

export const createSchool = async (schoolData: Omit<School, 'id'>): Promise<School> => {
    await delay(700);
    const newSchool: School = {
        ...schoolData,
        id: String(allSchools.length + 1),
    };
    allSchools.unshift(newSchool); // Add to the beginning
    return newSchool;
};

export const updateSchool = async (id: string, updates: Partial<School>): Promise<School> => {
    await delay(700);
    const schoolIndex = allSchools.findIndex(school => school.id === id);
    if (schoolIndex === -1) {
        throw new Error('School not found');
    }
    allSchools[schoolIndex] = { ...allSchools[schoolIndex], ...updates };
    return allSchools[schoolIndex];
};

export const deleteSchool = async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    const schoolIndex = allSchools.findIndex(school => school.id === id);
    if (schoolIndex === -1) {
        throw new Error('School not found');
    }
    allSchools.splice(schoolIndex, 1);
    return { success: true };
};