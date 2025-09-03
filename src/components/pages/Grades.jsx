import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { coursesService } from "@/services/api/coursesService";
import { gradesService } from "@/services/api/gradesService";
import { assignmentsService } from "@/services/api/assignmentsService";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, gradesData, assignmentsData] = await Promise.all([
        coursesService.getAll(),
        gradesService.getAll(),
        assignmentsService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
      
      // Convert grades array to object keyed by courseId
      const gradesMap = {};
      gradesData.forEach(grade => {
        gradesMap[grade.courseId] = grade;
      });
      setGrades(gradesMap);
      
    } catch (err) {
      console.error("Error loading grades data:", err);
      setError("Failed to load grades data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return { letter: "A+", color: "text-green-600" };
    if (percentage >= 93) return { letter: "A", color: "text-green-600" };
    if (percentage >= 90) return { letter: "A-", color: "text-green-600" };
    if (percentage >= 87) return { letter: "B+", color: "text-blue-600" };
    if (percentage >= 83) return { letter: "B", color: "text-blue-600" };
    if (percentage >= 80) return { letter: "B-", color: "text-blue-600" };
    if (percentage >= 77) return { letter: "C+", color: "text-yellow-600" };
    if (percentage >= 73) return { letter: "C", color: "text-yellow-600" };
    if (percentage >= 70) return { letter: "C-", color: "text-yellow-600" };
    if (percentage >= 67) return { letter: "D+", color: "text-orange-600" };
    if (percentage >= 65) return { letter: "D", color: "text-orange-600" };
    if (percentage >= 60) return { letter: "D-", color: "text-orange-600" };
    return { letter: "F", color: "text-red-600" };
  };

  const calculateOverallGPA = () => {
    const coursesWithGrades = courses.filter(course => grades[course.Id]?.currentGrade > 0);
    
    if (coursesWithGrades.length === 0) return { gpa: "0.00", totalCredits: 0 };
    
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    coursesWithGrades.forEach(course => {
      const grade = grades[course.Id];
      const gradePoints = getGradePoints(grade.currentGrade);
      const credits = course.credits || 3;
      
      totalGradePoints += gradePoints * credits;
      totalCredits += credits;
    });
    
    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";
    
    return { gpa, totalCredits };
  };

  const getGradePoints = (percentage) => {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 4.0;
    if (percentage >= 90) return 3.7;
    if (percentage >= 87) return 3.3;
    if (percentage >= 83) return 3.0;
    if (percentage >= 80) return 2.7;
    if (percentage >= 77) return 2.3;
    if (percentage >= 73) return 2.0;
    if (percentage >= 70) return 1.7;
    if (percentage >= 67) return 1.3;
    if (percentage >= 65) return 1.0;
    if (percentage >= 60) return 0.7;
    return 0.0;
  };

  const getProgressWidth = (percentage) => {
    return Math.min(Math.max(percentage, 0), 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "from-green-500 to-emerald-500";
    if (percentage >= 80) return "from-blue-500 to-blue-600";
    if (percentage >= 70) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-red-600";
  };

  const overallStats = calculateOverallGPA();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const coursesWithGrades = courses.filter(course => grades[course.Id]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Grades</h1>
        <p className="text-gray-600 mt-1">
          Track your academic performance and GPA across all courses
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-secondary-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Overall GPA</p>
                <p className="text-3xl font-bold text-primary-900">{overallStats.gpa}</p>
                <p className="text-sm text-gray-600">{overallStats.totalCredits} total credits</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="Trophy" className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Courses Graded</p>
                <p className="text-3xl font-bold text-green-900">{coursesWithGrades.length}</p>
                <p className="text-sm text-gray-600">of {courses.length} enrolled</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Average Grade</p>
                <p className="text-3xl font-bold text-blue-900">
                  {coursesWithGrades.length > 0 ? 
                    `${(Object.values(grades).reduce((sum, g) => sum + g.currentGrade, 0) / coursesWithGrades.length).toFixed(1)}%` 
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600">across all courses</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grades */}
      {coursesWithGrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => {
            const grade = grades[course.Id];
            if (!grade) return null;

            const letterGrade = getLetterGrade(grade.currentGrade);
            const courseAssignments = assignments.filter(a => a.courseId === course.Id);
            const completedAssignments = courseAssignments.filter(a => a.status === "completed");

            return (
              <Card key={course.Id} className="group hover:shadow-xl transition-all duration-300">
                {/* Course color indicator */}
                <div 
                  className="h-1 w-full"
                  style={{ backgroundColor: course.color }}
                />
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                        {course.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{course.professor}</p>
                      <p className="text-xs text-gray-500">{course.credits} credits • {course.semester}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${letterGrade.color}`}>
                        {letterGrade.letter}
                      </div>
                      <div className="text-sm text-gray-500">
                        {grade.currentGrade.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Grade Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{grade.currentGrade.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${getProgressColor(grade.currentGrade)} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${getProgressWidth(grade.currentGrade)}%` }}
                      />
                    </div>
                  </div>

                  {/* Grade Categories */}
                  {grade.categories && grade.categories.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Grade Breakdown</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {grade.categories.map((category, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">{category.name}</span>
                              <span className="text-sm font-medium text-gray-900">
                                {category.grade?.toFixed(1) || "N/A"}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Weight: {category.weight}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assignment Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {courseAssignments.length}
                      </div>
                      <div className="text-xs text-gray-500">Total Assignments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {completedAssignments.length}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No grades available"
          description="Grades will appear here once your courses have been graded"
          icon="Award"
        />
      )}
    </div>
  );
};

export default Grades;