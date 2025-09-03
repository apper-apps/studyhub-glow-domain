import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatsCards from "@/components/organisms/StatsCards";
import CourseCard from "@/components/organisms/CourseCard";
import AssignmentList from "@/components/organisms/AssignmentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { coursesService } from "@/services/api/coursesService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { gradesService } from "@/services/api/gradesService";
import { format, isAfter, isBefore, addDays } from "date-fns";

const Dashboard = ({ onQuickAdd }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, assignmentsData, gradesData] = await Promise.all([
        coursesService.getAll(),
        assignmentsService.getAll(),
        gradesService.getAll()
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
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get upcoming assignments (due within next 7 days)
  const getUpcomingAssignments = () => {
    const now = new Date();
    const nextWeek = addDays(now, 7);
    
    return assignments
      .filter(a => a.status === "pending")
      .filter(a => {
        const dueDate = new Date(a.dueDate);
        return isAfter(dueDate, now) && isBefore(dueDate, nextWeek);
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  // Get recently completed assignments
  const getRecentlyCompleted = () => {
    return assignments
      .filter(a => a.status === "completed")
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      .slice(0, 3);
  };

  // Get courses with assignments due soon
  const getCoursesWithUpcoming = () => {
    const upcomingAssignments = getUpcomingAssignments();
    const courseIds = [...new Set(upcomingAssignments.map(a => a.courseId))];
    
    return courses
      .filter(c => courseIds.includes(c.Id))
      .slice(0, 3);
  };

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      await assignmentsService.update(assignmentId, { status: newStatus });
      setAssignments(prev => 
        prev.map(a => a.Id === assignmentId ? { ...a, status: newStatus } : a)
      );
    } catch (error) {
      throw new Error("Failed to update assignment status");
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await assignmentsService.delete(assignmentId);
      setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
    } catch (error) {
      throw new Error("Failed to delete assignment");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const upcomingAssignments = getUpcomingAssignments();
  const recentlyCompleted = getRecentlyCompleted();
  const coursesWithUpcoming = getCoursesWithUpcoming();

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your academic overview for today.
          </p>
        </div>
        <Button 
          onClick={onQuickAdd}
          variant="primary" 
          size="lg" 
          className="gap-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          Quick Add Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards 
        assignments={assignments}
        courses={courses}
        grades={grades}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Upcoming Assignments */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="Clock" className="w-5 h-5 text-primary-500" />
                  Upcoming Assignments
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length > 0 ? (
                <AssignmentList
                  assignments={upcomingAssignments}
                  courses={courses}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ) : (
                <Empty
                  title="No upcoming assignments"
                  description="All caught up! No assignments due in the next 7 days."
                  icon="CheckCircle"
                  action={onQuickAdd}
                  actionText="Add Assignment"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Today's Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(), "EEEE, MMMM d")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Due Today</span>
                  <span className="text-sm font-semibold text-red-600">
                    {assignments.filter(a => 
                      a.status === "pending" && 
                      format(new Date(a.dueDate), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {upcomingAssignments.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-semibold text-green-600">
                    {assignments.filter(a => a.status === "completed").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Courses */}
          {coursesWithUpcoming.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coursesWithUpcoming.map(course => (
                  <div key={course.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{course.name}</p>
                      <p className="text-xs text-gray-600">{course.professor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {assignments.filter(a => a.courseId === course.Id && a.status === "pending").length} pending
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          {recentlyCompleted.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recently Completed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentlyCompleted.map(assignment => {
                  const course = courses.find(c => c.Id === assignment.courseId);
                  return (
                    <div key={assignment.Id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-xs text-gray-600">{course?.name}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;