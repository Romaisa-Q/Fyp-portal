// components/TeacherDashboard/Sidebar.jsx
import { 
  BookOpen, Calendar, Users, FileText, BarChart3, ClipboardCheck, LogOut, X 
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

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  onLogout = () => {}
}) {
  const SidebarContent = (
    <div className="flex flex-col h-full" style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
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
        {/* Close button (mobile only) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white hover:bg-white/5 p-1 rounded"
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
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
                  ${activeTab === item.key
                    ? 'bg-white/5 text-white'
                    : 'text-green-100 hover:bg-white/5 hover:text-white'}
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
      <div className="p-4 border-t border-white/10">
        <div
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-green-100 hover:bg-white/5 hover:text-white cursor-pointer transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 🖥️ Desktop Sidebar (Always Visible on lg+) */}
      <div className="hidden lg:block lg:w-72 lg:shrink-0">
        {SidebarContent}
      </div>

      {/* 📱 Mobile Sidebar (Slide-over) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative w-72 h-full bg-green-900 shadow-xl">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
