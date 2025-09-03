import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

export const coursesService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...courses];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  create: async (courseData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...courses.map(c => c.Id), 0);
    const newCourse = {
      ...courseData,
      Id: maxId + 1
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    courses[index] = { ...courses[index], ...updates };
    return { ...courses[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    courses.splice(index, 1);
    return true;
  }
};