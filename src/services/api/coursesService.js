import { toast } from "react-toastify";

export const coursesService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = response.data.map(course => ({
        Id: course.Id,
        name: course.Name || "",
        professor: course.professor_c || "",
        credits: course.credits_c || 3,
        color: course.color_c || "#6B7280",
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
        semester: course.semester_c || "",
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : []
      }));

      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };

      const response = await apperClient.getRecordById("course_c", id, params);

      if (!response || !response.data) {
        throw new Error("Course not found");
      }

      // Transform data to match UI expectations
      const course = response.data;
      return {
        Id: course.Id,
        name: course.Name || "",
        professor: course.professor_c || "",
        credits: course.credits_c || 3,
        color: course.color_c || "#6B7280",
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
        semester: course.semester_c || "",
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Course not found");
    }
  },

  create: async (courseData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format (only Updateable fields)
      const dbData = {
        Name: courseData.name || "",
        professor_c: courseData.professor || "",
        credits_c: courseData.credits || 3,
        color_c: courseData.color || "#6B7280",
        schedule_c: JSON.stringify(courseData.schedule || []),
        semester_c: courseData.semester || "",
        grade_categories_c: JSON.stringify(courseData.gradeCategories || [])
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} course records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create course");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const course = successfulRecord.data;
          return {
            Id: course.Id,
            name: course.Name || "",
            professor: course.professor_c || "",
            credits: course.credits_c || 3,
            color: course.color_c || "#6B7280",
            schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
            semester: course.semester_c || "",
            gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : []
          };
        }
      }

      throw new Error("Failed to create course");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  update: async (id, updates) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format (only Updateable fields)
      const dbData = {
        Id: parseInt(id),
        ...(updates.name !== undefined && { Name: updates.name }),
        ...(updates.professor !== undefined && { professor_c: updates.professor }),
        ...(updates.credits !== undefined && { credits_c: updates.credits }),
        ...(updates.color !== undefined && { color_c: updates.color }),
        ...(updates.schedule !== undefined && { schedule_c: JSON.stringify(updates.schedule) }),
        ...(updates.semester !== undefined && { semester_c: updates.semester }),
        ...(updates.gradeCategories !== undefined && { grade_categories_c: JSON.stringify(updates.gradeCategories) })
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} course records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update course");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const course = successfulRecord.data;
          return {
            Id: course.Id,
            name: course.Name || "",
            professor: course.professor_c || "",
            credits: course.credits_c || 3,
            color: course.color_c || "#6B7280",
            schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
            semester: course.semester_c || "",
            gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : []
          };
        }
      }

      throw new Error("Failed to update course");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} course records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};