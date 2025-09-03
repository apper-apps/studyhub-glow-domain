import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

export const gradesService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...grades];
  },

  getById: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grade = grades.find(g => g.courseId === parseInt(courseId));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  create: async (gradeData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newGrade = {
      ...gradeData
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  update: async (courseId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = grades.findIndex(g => g.courseId === parseInt(courseId));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...updates };
    return { ...grades[index] };
  },

  delete: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = grades.findIndex(g => g.courseId === parseInt(courseId));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades.splice(index, 1);
    return true;
  }
};