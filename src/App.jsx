import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import QuickAddModal from "@/components/molecules/QuickAddModal";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Grades from "@/components/pages/Grades";
import { coursesService } from "@/services/api/coursesService";
import { assignmentsService } from "@/services/api/assignmentsService";

function App() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  // Load courses for quick add modal
  const loadCourses = async () => {
    try {
      const coursesData = await coursesService.getAll();
      setCourses(coursesData);
    } catch (error) {
      console.error("Error loading courses for quick add:", error);
    }
  };

  const handleQuickAdd = () => {
    loadCourses();
    setIsQuickAddOpen(true);
  };

  const handleAddAssignment = async (assignmentData) => {
    try {
      await assignmentsService.create(assignmentData);
    } catch (error) {
      throw new Error("Failed to add assignment");
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout onQuickAdd={handleQuickAdd} />}>
            <Route index element={<Dashboard onQuickAdd={handleQuickAdd} />} />
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<Assignments onQuickAdd={handleQuickAdd} />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="grades" element={<Grades />} />
          </Route>
        </Routes>

        {/* Quick Add Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          courses={courses}
          onAdd={handleAddAssignment}
          type="assignment"
        />

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;