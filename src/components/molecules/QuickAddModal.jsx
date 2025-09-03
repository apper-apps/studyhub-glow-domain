import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { motion, AnimatePresence } from "framer-motion";

const QuickAddModal = ({ isOpen, onClose, courses, onAdd, type = "assignment" }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await onAdd({
        ...formData,
        status: "pending"
      });
      
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        priority: "medium",
        description: ""
      });
      
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
                Add {type === "assignment" ? "Assignment" : "Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickAddModal;