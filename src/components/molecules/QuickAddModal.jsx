import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { motion, AnimatePresence } from "framer-motion";

const QuickAddModal = ({ isOpen, onClose, courses, onAdd, type = "assignment" }) => {
  const getInitialFormData = () => {
    if (type === "course") {
      return {
        name: "",
        professor_c: "",
        credits_c: "",
        color_c: "#4f46e5",
        semester_c: "",
        schedule_c: "",
        grade_categories_c: ""
      };
    }
    return {
      title: "",
      courseId: "",
      dueDate: "",
      priority: "medium",
      description: ""
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on type
    if (type === "course") {
      if (!formData.name || !formData.professor_c || !formData.credits_c || !formData.semester_c) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else {
      if (!formData.title || !formData.courseId || !formData.dueDate) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

try {
      const submitData = type === "course" 
        ? formData 
        : { ...formData, status: "pending" };
        
      await onAdd(submitData);
      
      setFormData(getInitialFormData());
      
      toast.success(`${type === "assignment" ? "Assignment" : "Task"} added successfully!`);
      onClose();
    } catch (error) {
      toast.error("Failed to add item. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Add {type === "assignment" ? "Assignment" : "Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
{/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {type === "course" ? (
              <>
                <FormField
                  label="Course Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter course name"
                />
                
                <FormField
                  label="Professor *"
                  name="professor_c"
                  value={formData.professor_c}
                  onChange={handleChange}
                  placeholder="Enter professor name"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Credits *"
                    type="number"
                    name="credits_c"
                    value={formData.credits_c}
                    onChange={handleChange}
                    placeholder="3"
                    min="1"
                    max="6"
                  />
                  
                  <FormField
                    label="Color"
                    type="color"
                    name="color_c"
                    value={formData.color_c}
                    onChange={handleChange}
                  />
                </div>
                
                <FormField
                  label="Semester *"
                  name="semester_c"
                  value={formData.semester_c}
                  onChange={handleChange}
                  placeholder="Fall 2024"
                />
                
                <FormField
                  label="Schedule"
                  type="textarea"
                  name="schedule_c"
                  value={formData.schedule_c}
                  onChange={handleChange}
                  placeholder="MWF 10:00-11:00 AM"
                />
                
                <FormField
                  label="Grade Categories"
                  type="textarea"
                  name="grade_categories_c"
                  value={formData.grade_categories_c}
                  onChange={handleChange}
                  placeholder="Exams 40%, Homework 30%, Participation 30%"
                />
              </>
            ) : (
              <>
                <FormField
                  label="Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter assignment title"
                />
<FormField
                  label="Course *"
                  type="select"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.Id} value={course.Id}>
                      {course.name}
                    </option>
                  ))}
                </FormField>
                
                <FormField
                  label="Due Date *"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
                
                <FormField
                  label="Priority"
                  type="select"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </FormField>
                
                <FormField
                  label="Description"
                  type="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                />
              </>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
className="flex-1 gap-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add {type === "assignment" ? "Assignment" : type === "course" ? "Course" : "Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickAddModal;