import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { toast } from "react-toastify";

const AssignmentList = ({ assignments = [], courses = [], onStatusChange, onDelete }) => {
  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId) || { name: "Unknown Course", color: "#6B7280" };
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  const getStatusVariant = (status, dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (status === "completed") return "completed";
    if (isAfter(now, due)) return "overdue";
    if (isBefore(due, addDays(now, 2))) return "warning";
    return "pending";
  };

  const getStatusText = (status, dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (status === "completed") return "Completed";
    if (isAfter(now, due)) return "Overdue";
    if (isBefore(due, addDays(now, 1))) return "Due Soon";
    return "Pending";
  };

  const handleStatusToggle = async (assignment) => {
    try {
      const newStatus = assignment.status === "completed" ? "pending" : "completed";
      await onStatusChange(assignment.Id, newStatus);
      toast.success(`Assignment ${newStatus === "completed" ? "completed" : "reopened"}!`);
    } catch (error) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleDelete = async (assignment) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await onDelete(assignment.Id);
        toast.success("Assignment deleted successfully");
      } catch (error) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const course = getCourse(assignment.courseId);
        const statusVariant = getStatusVariant(assignment.status, assignment.dueDate);
        const statusText = getStatusText(assignment.status, assignment.dueDate);
        
        return (
          <Card 
            key={assignment.Id} 
            className="group hover:shadow-lg transition-all duration-200"
          >
            {/* Course color indicator */}
            <div 
              className="h-1 w-full"
              style={{ backgroundColor: course.color }}
            />
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between space-x-4">
                {/* Assignment info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600">{course.name}</p>
                    </div>
                    
                    {/* Priority and Status badges */}
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityVariant(assignment.priority)} size="sm">
                        {assignment.priority}
                      </Badge>
                      <Badge variant={statusVariant} size="sm">
                        {statusText}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  {assignment.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {assignment.description}
                    </p>
                  )}

                  {/* Due date info */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                      {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                      {getDaysUntilDue(assignment.dueDate)}
                    </div>
                    {assignment.grade && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Award" className="w-4 h-4 mr-2" />
                        {assignment.grade}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant={assignment.status === "completed" ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleStatusToggle(assignment)}
                    className="gap-2 min-w-[100px]"
                  >
                    <ApperIcon 
                      name={assignment.status === "completed" ? "RotateCcw" : "Check"} 
                      className="w-4 h-4" 
                    />
                    {assignment.status === "completed" ? "Reopen" : "Complete"}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(assignment)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AssignmentList;