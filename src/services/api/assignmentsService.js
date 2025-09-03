import { toast } from "react-toastify";

export const assignmentsService = {
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null,
        title: assignment.title_c || assignment.Name || "",
        description: assignment.description_c || "",
        dueDate: assignment.due_date_c || "",
        priority: assignment.priority_c || "medium",
        status: assignment.status_c || "pending",
        grade: assignment.grade_c || null,
        category: assignment.category_c || ""
      }));

      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } }
        ]
      };

      const response = await apperClient.getRecordById("assignment_c", id, params);

      if (!response || !response.data) {
        throw new Error("Assignment not found");
      }

      // Transform data to match UI expectations
      const assignment = response.data;
      return {
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null,
        title: assignment.title_c || assignment.Name || "",
        description: assignment.description_c || "",
        dueDate: assignment.due_date_c || "",
        priority: assignment.priority_c || "medium",
        status: assignment.status_c || "pending",
        grade: assignment.grade_c || null,
        category: assignment.category_c || ""
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Assignment not found");
    }
  },

  create: async (assignmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format (only Updateable fields)
      const dbData = {
        Name: assignmentData.title || "",
        course_id_c: parseInt(assignmentData.courseId) || null,
        title_c: assignmentData.title || "",
        description_c: assignmentData.description || "",
        due_date_c: assignmentData.dueDate || "",
        priority_c: assignmentData.priority || "medium",
        status_c: assignmentData.status || "pending",
        grade_c: assignmentData.grade || null,
        category_c: assignmentData.category || ""
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} assignment records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create assignment");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const assignment = successfulRecord.data;
          return {
            Id: assignment.Id,
            courseId: assignment.course_id_c?.Id || assignment.course_id_c || null,
            title: assignment.title_c || assignment.Name || "",
            description: assignment.description_c || "",
            dueDate: assignment.due_date_c || "",
            priority: assignment.priority_c || "medium",
            status: assignment.status_c || "pending",
            grade: assignment.grade_c || null,
            category: assignment.category_c || ""
          };
        }
      }

      throw new Error("Failed to create assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
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
        ...(updates.title !== undefined && { Name: updates.title, title_c: updates.title }),
        ...(updates.courseId !== undefined && { course_id_c: parseInt(updates.courseId) }),
        ...(updates.description !== undefined && { description_c: updates.description }),
        ...(updates.dueDate !== undefined && { due_date_c: updates.dueDate }),
        ...(updates.priority !== undefined && { priority_c: updates.priority }),
        ...(updates.status !== undefined && { status_c: updates.status }),
        ...(updates.grade !== undefined && { grade_c: updates.grade }),
        ...(updates.category !== undefined && { category_c: updates.category })
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} assignment records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update assignment");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const assignment = successfulRecord.data;
          return {
            Id: assignment.Id,
            courseId: assignment.course_id_c?.Id || assignment.course_id_c || null,
            title: assignment.title_c || assignment.Name || "",
            description: assignment.description_c || "",
            dueDate: assignment.due_date_c || "",
            priority: assignment.priority_c || "medium",
            status: assignment.status_c || "pending",
            grade: assignment.grade_c || null,
            category: assignment.category_c || ""
          };
        }
      }

      throw new Error("Failed to update assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} assignment records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};