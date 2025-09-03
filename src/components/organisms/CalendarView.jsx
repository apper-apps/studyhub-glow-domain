import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";

const CalendarView = ({ assignments = [], courses = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month or week

  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId) || { name: "Unknown Course", color: "#6B7280" };
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add padding days from previous month
    const startDay = monthStart.getDay();
    const paddingDays = [];
    for (let i = startDay - 1; i >= 0; i--) {
      const paddingDate = new Date(monthStart);
      paddingDate.setDate(paddingDate.getDate() - (i + 1));
      paddingDays.push(paddingDate);
    }

    // Add padding days from next month
    const endDay = monthEnd.getDay();
    const endPaddingDays = [];
    for (let i = 1; i <= (6 - endDay); i++) {
      const paddingDate = new Date(monthEnd);
      paddingDate.setDate(paddingDate.getDate() + i);
      endPaddingDays.push(paddingDate);
    }

    const allDays = [...paddingDays, ...days, ...endPaddingDays];

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {allDays.map((date, index) => {
            const dayAssignments = getAssignmentsForDate(date);
            const isCurrentMonth = date >= monthStart && date <= monthEnd;
            const isCurrentDay = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-gray-100 rounded-lg transition-colors hover:bg-gray-50 ${
                  !isCurrentMonth ? "text-gray-300 bg-gray-50/50" : ""
                } ${isCurrentDay ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <div className={`text-sm font-medium ${isCurrentDay ? "text-blue-600" : "text-gray-900"}`}>
                  {format(date, "d")}
                </div>
                
                <div className="space-y-1 mt-1">
                  {dayAssignments.slice(0, 2).map(assignment => {
                    const course = getCourse(assignment.courseId);
                    return (
                      <div
                        key={assignment.Id}
                        className="text-xs p-1 rounded truncate"
                        style={{ 
                          backgroundColor: `${course.color}20`,
                          borderLeft: `3px solid ${course.color}`
                        }}
                      >
                        {assignment.title}
                      </div>
                    );
                  })}
                  
                  {dayAssignments.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayAssignments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUpcomingList = () => {
    const upcomingAssignments = assignments
      .filter(a => new Date(a.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 10);

    return (
      <div className="space-y-3">
        {upcomingAssignments.map(assignment => {
          const course = getCourse(assignment.courseId);
          const daysUntil = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={assignment.Id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    </div>
                    
                    <p className="text-sm text-gray-600">{course.name}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{format(new Date(assignment.dueDate), "MMM d, yyyy")}</span>
                      <Badge variant={daysUntil <= 1 ? "danger" : daysUntil <= 3 ? "warning" : "default"} size="sm">
                        {daysUntil === 0 ? "Due today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                      </Badge>
                    </div>
                  </div>
                  
                  <Badge variant={assignment.priority} size="sm">
                    {assignment.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {upcomingAssignments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No upcoming assignments</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-2xl text-gradient">
                {format(currentDate, "MMMM yyyy")}
              </CardTitle>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="p-2"
                >
                  <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="p-2"
                >
                  <ApperIcon name="ChevronRight" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={view === "month" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
                className="gap-2"
              >
                <ApperIcon name="Calendar" className="w-4 h-4" />
                Month
              </Button>
              <Button
                variant={view === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="gap-2"
              >
                <ApperIcon name="List" className="w-4 h-4" />
                Upcoming
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-6">
          {view === "month" ? renderMonthView() : renderUpcomingList()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;