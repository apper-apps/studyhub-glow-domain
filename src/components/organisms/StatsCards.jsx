import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";

const StatsCards = ({ assignments = [], courses = [], grades = {} }) => {
  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  const pendingAssignments = assignments.filter(a => a.status === "pending").length;
  const overdueAssignments = assignments.filter(a => {
    return a.status === "pending" && new Date(a.dueDate) < new Date();
  }).length;

  // Calculate overall GPA
  const courseGrades = Object.values(grades).filter(g => g.currentGrade > 0);
  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 3), 0);
  const weightedGrade = courseGrades.reduce((sum, grade, index) => {
    const course = courses[index];
    const credits = course?.credits || 3;
    return sum + (grade.currentGrade * credits);
  }, 0);
  const overallGPA = totalCredits > 0 ? (weightedGrade / totalCredits / 25).toFixed(2) : "0.00";

  const stats = [
    {
      title: "Total Assignments",
      value: totalAssignments,
      icon: "FileText",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      change: completedAssignments > 0 ? `${Math.round((completedAssignments / totalAssignments) * 100)}% completed` : "No progress yet"
    },
    {
      title: "Completed",
      value: completedAssignments,
      icon: "CheckCircle",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      change: totalAssignments > 0 ? `${Math.round((completedAssignments / totalAssignments) * 100)}% of total` : "Start completing tasks"
    },
    {
      title: "Pending",
      value: pendingAssignments,
      icon: "Clock",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      change: pendingAssignments > 0 ? "Need attention" : "All caught up!"
    },
    {
      title: "Overall GPA",
      value: overallGPA,
      icon: "Award",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      change: `${courses.length} courses enrolled`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
              
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <div className={`w-6 h-6 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Progress bar for assignments */}
            {(stat.title === "Total Assignments" || stat.title === "Completed") && totalAssignments > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.round((completedAssignments / totalAssignments) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;