import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AssignmentList from "@/components/organisms/AssignmentList";
import SearchBar from "@/components/molecules/SearchBar";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";
import { format, isAfter } from "date-fns";

const Assignments = ({ onQuickAdd }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsService.getAll(),
        coursesService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setCourses(coursesData);
      
    } catch (err) {
      console.error("Error loading assignments data:", err);
      setError("Failed to load assignments data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "overdue" ? 
                          (assignment.status === "pending" && isAfter(new Date(), new Date(assignment.dueDate))) :
                          assignment.status === filterStatus);
    
    const matchesCourse = filterCourse === "all" || assignment.courseId === filterCourse;
    const matchesPriority = filterPriority === "all" || assignment.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesPriority;
  });

  // Sort assignments by due date
  const sortedAssignments = filteredAssignments.sort((a, b) => {
    // Completed assignments go to bottom
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;
    
    // Sort by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Calculate stats
  const getStats = () => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === "completed").length;
    const pending = assignments.filter(a => a.status === "pending").length;
    const overdue = assignments.filter(a => 
      a.status === "pending" && isAfter(new Date(), new Date(a.dueDate))
    ).length;

    return { total, completed, pending, overdue };
  };

  const stats = getStats();

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterCourse("all");
    setFilterPriority("all");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Assignments</h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your academic assignments
          </p>
        </div>

        <Button 
          onClick={onQuickAdd}
          variant="primary" 
          size="lg" 
          className="gap-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          Add Assignment
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assignments..."
          onClear={() => setSearchQuery("")}
        />

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex items-center gap-1">
              {["all", "pending", "completed", "overdue"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    filterStatus === status
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Course:</span>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.Id} value={course.Id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterStatus !== "all" || filterCourse !== "all" || filterPriority !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <ApperIcon name="X" className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchQuery || filterStatus !== "all" || filterCourse !== "all" || filterPriority !== "all") && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <Badge variant="primary" className="gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filterStatus !== "all" && (
              <Badge variant="primary" className="gap-1">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus("all")}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filterCourse !== "all" && (
              <Badge variant="primary" className="gap-1">
                Course: {courses.find(c => c.Id === filterCourse)?.name}
                <button onClick={() => setFilterCourse("all")}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filterPriority !== "all" && (
              <Badge variant="primary" className="gap-1">
                Priority: {filterPriority}
                <button onClick={() => setFilterPriority("all")}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {sortedAssignments.length} of {assignments.length} assignments
      </div>

      {/* Assignments List */}
      {sortedAssignments.length > 0 ? (
        <AssignmentList
          assignments={sortedAssignments}
          courses={courses}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : assignments.length === 0 ? (
        <Empty
          title="No assignments yet"
          description="Start by adding your first assignment to stay organized"
          icon="FileText"
          action={onQuickAdd}
          actionText="Add Assignment"
        />
      ) : (
        <Empty
          title="No matching assignments"
          description="Try adjusting your search or filter criteria"
          icon="Search"
          action={clearFilters}
          actionText="Clear Filters"
        />
      )}
    </div>
  );
};

export default Assignments;