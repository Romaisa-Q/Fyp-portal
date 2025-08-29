// components/TeacherDashboard/Sidebar.jsx
import { 
  BookOpen, Calendar, Users, FileText, BarChart3, ClipboardCheck, LogOut, ChevronDown, X
} from 'lucide-react';
import { COLLEGE_COLORS } from '../constants/color';

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'classList', label: 'Class List', icon: BookOpen },
  { key: 'grading', label: 'Grading', icon: Users },
  { key: 'attendance', label: 'Attendance', icon: Calendar },
  { key: 'assignments', label: 'Assignments', icon: FileText },
  { key: 'announcements', label: 'Announcements', icon: ClipboardCheck },
  { key: 'schedule', label: 'Schedule', icon: Calendar },
];


export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, onLogout = () => {} }) {

  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      role="dialog"
      aria-modal="true"
      aria-label="Teacher dashboard sidebar"
    >
      <div className="flex flex-col h-full" style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-600">
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Teacher Portal</h2>
              <p className="text-green-200 text-sm">Learning Dashboard</p>
            </div>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-green-600 p-1 rounded"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
           {sidebarItems.map((item) => (
  <li key={item.key}>
    <div
      onClick={() => {
        setActiveTab(item.key);
        setSidebarOpen(false); // mobile view me close bhi ho jaye
      }}
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
        ${activeTab === item.key ? 'bg-green-600 text-white' : 'text-green-100 hover:bg-green-600 hover:text-white'}
      `}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
    </div>
  </li>
))}
 </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-green-600">
          <div
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-600 hover:text-white cursor-pointer transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
