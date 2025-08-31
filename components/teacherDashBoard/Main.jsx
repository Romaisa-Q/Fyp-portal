// components/TeacherDashboard/Main.jsx
import { useState, useEffect } from 'react';
import Sidebar from './Layout/Sidebar';
import Overview from './Overview/Oveview';
import DashboardHeader from './Layout/DashboardHeader';
import { useRouter } from 'next/router';
import Grading from './Grading/Grading';
import ClassList from './MyClasses/ClassList';
export default function Main() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [gradingSection, setGradingSection] = useState('grade-assignments');
  // Optional: Close on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  const [activeTab, setActiveTab] = useState('overview'); // default tab

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

<Sidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  gradingSection={gradingSection}
  setGradingSection={setGradingSection}
  onLogout={() => router.back()} // ya jo logout logic tum chaho
/>

  <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
    {/* Top Navigation */}
<DashboardHeader setSidebarOpen={setSidebarOpen} />


        {/* Content */}
       {/* <main className="flex-1 overflow-y-auto p-4 lg:p-6">
  {activeTab === 'overview' && <Overview />}
  {activeTab === 'classList' && <ClassList />}
   {activeTab === 'grading' && <Grading />}
  {/* {activeTab === 'attendance' && <Attendance />}
  {activeTab === 'assignments' && <Assignments />}
  {activeTab === 'announcements' && <Announcements />}
  {activeTab === 'schedule' && <Schedule />} */} 
  <main className="flex-1 overflow-y-auto p-4 lg:p-6">
  {activeTab === 'overview' && <Overview />}
  {activeTab === 'classList' && <ClassList />}
  {activeTab === 'grading' && (
    <Grading defaultSection={gradingSection} />
  )}
</main>

      </div>
    </div>
  );
}
