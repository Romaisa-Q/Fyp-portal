import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { attendanceManager } from '../../utils/attendanceStorage.js';
import AttendanceHeader from './../Attendance/AttendanceHeader';
import MarkAttendance from './../Attendance/MarkAttendance';
import AttendanceReports from './../Attendance/AttendanceReports.jsx';
import { ClipboardList, BarChart3, RefreshCw } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { Button } from '../../ui/button';

// Mock API function - simulates daily data from student dashboard
const fetchDailyAttendanceFromAPI = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const dailyAPIData = [
    { studentName: 'Ahmad Hassan', department: 'CS-3rd', subject: 'Database Systems', status: 'present', markedBy: 'student' },
    { studentName: 'Fatima Khan', department: 'CS-3rd', subject: 'Database Systems', status: 'present', markedBy: 'student' },
    { studentName: 'Ali Ahmed', department: 'CS-3rd', subject: 'Database Systems', status: 'absent', markedBy: 'student' },
    { studentName: 'Ayesha Malik', department: 'IT-2nd', subject: 'Web Development', status: 'present', markedBy: 'student' },
    { studentName: 'Hassan Ali', department: 'CS-2nd', subject: 'Data Structures', status: 'present', markedBy: 'student' },
    { studentName: 'Zara Sheikh', department: 'IT-2nd', subject: 'Web Development', status: 'present', markedBy: 'student' },
    { studentName: 'Omar Farooq', department: 'CS-3rd', subject: 'Database Systems', status: 'present', markedBy: 'student' },
    { studentName: 'Sana Riaz', department: 'IT-2nd', subject: 'Web Development', status: 'absent', markedBy: 'student' },
    { studentName: 'Muhammad Usman', department: 'CS-1st', subject: 'Programming Basics', status: 'present', markedBy: 'student' },
    { studentName: 'Aisha Noor', department: 'IT-1st', subject: 'Computer Fundamentals', status: 'present', markedBy: 'student' },
  ];
  return dailyAPIData;
};

// CSV helpers (unchanged)
const generateCSV = (data, period) => {
  if (data.length === 0) return '';
  let csvContent = '';
  let headers = [];
  if (period === 'daily') {
    headers = ['Student Name', 'Department', 'Subject', 'Date', 'Status', 'Marked By'];
    csvContent = headers.join(',') + '\n';
    data.forEach(record => {
      const row = [
        record.studentName,
        record.department,
        record.subject || '',
        record.date,
        record.status,
        record.markedBy || 'teacher'
      ];
      csvContent += row.join(',') + '\n';
    });
  } else {
    headers = ['Student Name', 'Department', 'Total Classes', 'Attended', 'Percentage', 'Status'];
    csvContent = headers.join(',') + '\n';
    data.forEach(record => {
      const row = [
        record.studentName,
        record.department,
        record.totalClasses,
        record.attended,
        record.percentage + '%',
        record.status
      ];
      csvContent += row.join(',') + '\n';
    });
  }
  return csvContent;
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// FIX: destructure props properly (onFetchNewData is optional function)
export default function Attendance({ onFetchNewData = () => {} }) {
  // Section state
  const [activeSection, setActiveSection] = useState('mark');
  // Attendance data states
  const [activeTab, setActiveTab] = useState('daily');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Load data when tab or department changes
  useEffect(() => {
    loadAttendanceData();
  }, [activeTab, selectedDepartment]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const data = attendanceManager.getFilteredData(activeTab === 'daily' ? 'daily' : activeTab, selectedDepartment);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch new daily data from API (simulate student marking attendance)
  const fetchNewDailyData = async () => {
    setLoading(true);
    try {
      const apiData = await fetchDailyAttendanceFromAPI();
      const processedData = attendanceManager.processDailyAttendance(apiData);
      setAttendanceData(processedData);
      toast.success('Daily attendance data updated!');
    } catch (error) {
      console.error('Error fetching daily data:', error);
      toast.error('Failed to fetch daily attendance');
    } finally {
      setLoading(false);
    }
  };

  // Wrapper so onClick always gets a function and parent is notified if provided
  const handleSyncClick = async () => {
    await fetchNewDailyData();
    try {
      if (typeof onFetchNewData === 'function') onFetchNewData();
    } catch (err) {
      console.warn('onFetchNewData threw error:', err);
    }
  };

  // Get statistics
  const stats = attendanceManager.getAttendanceStats(activeTab);

  // Handle attendance editing (teacher control)
  const handleEditStatus = (recordId, newStatus) => {
    const record = attendanceData.find((r) => r.id === recordId);
    if (record) {
      const date = record.date || new Date().toISOString().split('T')[0];
      attendanceManager.updateAttendanceStatus(date, record.studentName, record.department, newStatus);
      loadAttendanceData();
      toast.success('Attendance updated successfully');
    }
  };

  const handleExport = () => {
    const csvContent = generateCSV(attendanceData, activeTab);
    const filename = `attendance_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    toast.success(`Attendance data exported successfully as ${filename}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with section navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Attendance Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage student attendance with automatic calculation & teacher control
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant={activeSection === 'mark' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${activeSection === 'mark' ? 'text-white' : 'text-gray-600 hover:text-gray-800'}`}
            style={activeSection === 'mark' ? { backgroundColor: COLLEGE_COLORS.darkGreen } : {}}
            onClick={() => setActiveSection('mark')}
          >
            <ClipboardList className="w-4 h-4" />
            Mark Attendance
          </Button>

          <Button
            variant={activeSection === 'reports' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${activeSection === 'reports' ? 'text-white' : 'text-gray-600 hover:text-gray-800'}`}
            style={activeSection === 'reports' ? { backgroundColor: COLLEGE_COLORS.darkGreen } : {}}
            onClick={() => setActiveSection('reports')}
          >
            <BarChart3 className="w-4 h-4" />
            Reports
          </Button>

          {activeTab === 'daily' && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleSyncClick}   // <-- ALWAYS a function
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" />
              Sync Daily Data
            </Button>
          )}
        </div>
      </div>

      {/* Section Content */}
      {activeSection === 'mark' && (
        <MarkAttendance
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          attendanceData={attendanceData}
          loading={loading}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          onEditStatus={handleEditStatus}
          onFetchNewData={fetchNewDailyData}
          onExport={handleExport}
          stats={stats}
        />
      )}

      {activeSection === 'reports' && (
        <AttendanceReports
          period={activeTab}
          data={attendanceData}
          onClose={() => setActiveSection('mark')}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
