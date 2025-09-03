import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent } from "@/components/atoms/Card";
import { format } from "date-fns";

const CourseCard = ({ course, assignments = [], grades = {} }) => {
  const upcomingAssignments = assignments
    .filter(a => a.courseId === course.Id && a.status === "pending")
    .slice(0, 3);
  
  const currentGrade = grades[course.Id]?.currentGrade || 0;
  const letterGrade = grades[course.Id]?.letterGrade || "N/A";

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Course color indicator */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: course.color }}
      />
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600">{course.professor}</p>
              <p className="text-xs text-gray-500">
                {course.credits} credits • {course.semester}
              </p>
            </div>
            
            {/* Grade circle */}
            <div className="text-center">
              <div className={`text-2xl font-bold ${getGradeColor(currentGrade)}`}>
                {letterGrade}
              </div>
              <div className="text-xs text-gray-500">
                {currentGrade > 0 ? `${currentGrade.toFixed(1)}%` : "No grades"}
              </div>
            </div>
          </div>

          {/* Schedule */}
          {course.schedule && course.schedule.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                Schedule
              </div>
              <div className="space-y-1">
                {course.schedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Assignments */}
          {upcomingAssignments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Upcoming</span>
                <Badge variant="primary" size="sm">
                  {upcomingAssignments.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-900 font-medium truncate flex-1">
                      {assignment.title}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {format(new Date(assignment.dueDate), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {assignments.filter(a => a.courseId === course.Id).length}
              </div>
              <div className="text-xs text-gray-500">Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {assignments.filter(a => a.courseId === course.Id && a.status === "completed").length}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;