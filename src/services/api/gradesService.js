import { toast } from "react-toastify";

export const gradesService = {
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "categories_c" } },
          { field: { Name: "assignments_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = response.data.map(grade => ({
        courseId: grade.course_id_c?.Id || grade.course_id_c || null,
        currentGrade: grade.current_grade_c || 0,
        letterGrade: grade.letter_grade_c || "",
        categories: grade.categories_c ? JSON.parse(grade.categories_c) : [],
        assignments: grade.assignments_c ? JSON.parse(grade.assignments_c) : []
      }));

      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  getById: async (courseId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "categories_c" } },
          { field: { Name: "assignments_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("grade_c", params);

      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error("Grade not found");
      }

      // Transform data to match UI expectations
      const grade = response.data[0];
      return {
        courseId: grade.course_id_c?.Id || grade.course_id_c || null,
        currentGrade: grade.current_grade_c || 0,
        letterGrade: grade.letter_grade_c || "",
        categories: grade.categories_c ? JSON.parse(grade.categories_c) : [],
        assignments: grade.assignments_c ? JSON.parse(grade.assignments_c) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade for course ${courseId}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Grade not found");
    }
  },

  create: async (gradeData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format (only Updateable fields)
      const dbData = {
        Name: `Grade for Course ${gradeData.courseId}`,
        course_id_c: parseInt(gradeData.courseId) || null,
        current_grade_c: gradeData.currentGrade || 0,
        letter_grade_c: gradeData.letterGrade || "",
        categories_c: JSON.stringify(gradeData.categories || []),
        assignments_c: JSON.stringify(gradeData.assignments || [])
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create grade");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const grade = successfulRecord.data;
          return {
            courseId: grade.course_id_c?.Id || grade.course_id_c || null,
            currentGrade: grade.current_grade_c || 0,
            letterGrade: grade.letter_grade_c || "",
            categories: grade.categories_c ? JSON.parse(grade.categories_c) : [],
            assignments: grade.assignments_c ? JSON.parse(grade.assignments_c) : []
          };
        }
      }

      throw new Error("Failed to create grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  update: async (courseId, updates) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, find the grade record by courseId
      const findParams = {
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        fields: [
          { field: { Name: "Id" } }
        ]
      };

      const findResponse = await apperClient.fetchRecords("grade_c", findParams);
      
      if (!findResponse.success || !findResponse.data || findResponse.data.length === 0) {
        throw new Error("Grade record not found");
      }

      const gradeId = findResponse.data[0].Id;

      // Transform UI data to database format (only Updateable fields)
      const dbData = {
        Id: gradeId,
        ...(updates.currentGrade !== undefined && { current_grade_c: updates.currentGrade }),
        ...(updates.letterGrade !== undefined && { letter_grade_c: updates.letterGrade }),
        ...(updates.categories !== undefined && { categories_c: JSON.stringify(updates.categories) }),
        ...(updates.assignments !== undefined && { assignments_c: JSON.stringify(updates.assignments) })
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update grade");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const grade = successfulRecord.data;
          return {
            courseId: grade.course_id_c?.Id || grade.course_id_c || null,
            currentGrade: grade.current_grade_c || 0,
            letterGrade: grade.letter_grade_c || "",
            categories: grade.categories_c ? JSON.parse(grade.categories_c) : [],
            assignments: grade.assignments_c ? JSON.parse(grade.assignments_c) : []
          };
        }
      }

      throw new Error("Failed to update grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  delete: async (courseId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, find the grade record by courseId
      const findParams = {
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        fields: [
          { field: { Name: "Id" } }
        ]
      };

      const findResponse = await apperClient.fetchRecords("grade_c", findParams);
      
      if (!findResponse.success || !findResponse.data || findResponse.data.length === 0) {
        throw new Error("Grade record not found");
      }

      const gradeId = findResponse.data[0].Id;

      const params = {
        RecordIds: [gradeId]
      };

      const response = await apperClient.deleteRecord("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};