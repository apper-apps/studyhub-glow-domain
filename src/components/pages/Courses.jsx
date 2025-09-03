import React, { useEffect, useState } from "react";
import { coursesService } from "@/services/api/coursesService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { gradesService } from "@/services/api/gradesService";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/organisms/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Grades from "@/components/pages/Grades";
import Button from "@/components/atoms/Button";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSemester, setFilterSemester] = useState("all");

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
      console.error("Error loading courses data:", err);
      setError("Failed to load courses data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get unique semesters for filter
  const semesters = [...new Set(courses.map(course => course.semester))];

  // Filter courses based on search and semester
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.professor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = filterSemester === "all" || course.semester === filterSemester;
    
    return matchesSearch && matchesSemester;
  });

  // Calculate semester statistics
  const getStats = () => {
    const totalCourses = courses.length;
    const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 3), 0);
    const coursesWithGrades = Object.keys(grades).length;
    const averageGrade = coursesWithGrades > 0 
      ? Object.values(grades).reduce((sum, grade) => sum + grade.currentGrade, 0) / coursesWithGrades 
      : 0;

    return { totalCourses, totalCredits, coursesWithGrades, averageGrade };
  };

  const stats = getStats();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage your academic courses and track your progress
          </p>
        </div>
<Button 
          variant="primary" 
          size="lg" 
          className="gap-2"
          onClick={() => {
            // TODO: Implement add course functionality
            console.log('Add course clicked');
          }}
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          Add Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Courses</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Credits</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalCredits}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="Award" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">With Grades</p>
              <p className="text-2xl font-bold text-purple-900">{stats.coursesWithGrades}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Average Grade</p>
              <p className="text-2xl font-bold text-amber-900">
                {stats.averageGrade > 0 ? `${stats.averageGrade.toFixed(1)}%` : "N/A"}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="Star" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses or professors..."
            onClear={() => setSearchQuery("")}
          />
        </div>

        <div className="sm:w-48">
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          >
            <option value="all">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.Id}
              course={course}
              assignments={assignments}
              grades={grades}
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Empty
          title="No courses yet"
          description="Start by adding your first course to get organized"
          icon="BookOpen"
          actionText="Add Course"
        />
      ) : (
        <Empty
          title="No matching courses"
          description="Try adjusting your search or filter criteria"
          icon="Search"
        />
      )}
    </div>
  );
};

export default Courses;