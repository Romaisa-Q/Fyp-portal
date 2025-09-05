import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Search, BarChart3 } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { Card, CardContent } from '../../ui/card.jsx';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';
import { attendanceManager } from '../../utils/attendanceStorage.js';

// Import period components
import DailyAttendance from './periods/DailyAttendance';
import WeeklyAttendance from './periods/WeeklyAttendance';
import MonthlyAttendance from './periods/MonthlyAttendance';
import SemesterAttendance from './periods/SemesterAttendance';

const fetchDailyAttendanceFromAPI = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock API response - only daily data as specified
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

// CSV export functions
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

export default function MarkAttendance({
  activeTab,
  setActiveTab,
  onFetchNewData,
  onExport
}) {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Load data when tab changes
  useEffect(() => {
    loadAttendanceData();
  }, [activeTab, selectedDepartment]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'daily') {
        // For daily tab, we might fetch new data from API
        // For now, just load existing daily data
        const data = attendanceManager.getFilteredData('daily', selectedDepartment);
        setAttendanceData(data);
      } else {
        // For weekly/monthly/semester, use calculated data
        const data = attendanceManager.getFilteredData(activeTab, selectedDepartment);
        setAttendanceData(data);
      }
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
      onFetchNewData(); // Notify parent component
    } catch (error) {
      console.error('Error fetching daily data:', error);
      toast.error('Failed to fetch daily attendance');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = attendanceData.filter((record) =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get statistics using attendance manager
  const stats = attendanceManager.getAttendanceStats(activeTab);

  // Handle attendance editing (teacher control)
  const handleEditStatus = (recordId, newStatus) => {
    const record = attendanceData.find((r) => r.id === recordId);
    if (record) {
      const date = record.date || new Date().toISOString().split('T')[0];
      attendanceManager.updateAttendanceStatus(date, record.studentName, record.department, newStatus);
      // Refresh current view data
      loadAttendanceData();
      toast.success('Attendance updated successfully');
    }
  };

  const handleExport = () => {
    const csvContent = generateCSV(filteredData, activeTab);
    const filename = `attendance_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    toast.success(`Attendance data exported successfully as ${filename}`);
    onExport(); // Notify parent component
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTab === 'daily' ? (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                      {stats.total}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-2xl font-semibold text-green-600">{stats.present}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-2xl font-semibold text-red-600">{stats.absent}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                      {stats.percentage}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                      {stats.totalStudents}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Attendance</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                      {stats.averageAttendance}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Excellent (90%+)</p>
                    <p className="text-2xl font-semibold text-green-600">{stats.excellent}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Need Attention </p>
                    <p className="text-2xl font-semibold text-red-600">{stats.warning}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#66bb6a] focus:ring-[#66bb6a]"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="cs">Computer Science</SelectItem>
            <SelectItem value="it">Information Technology</SelectItem>
            <SelectItem value="se">Software Engineering</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="semester">Semester</TabsTrigger>
        </TabsList>

        {/* Daily Attendance */}
        <TabsContent value="daily" className="space-y-4">
          <DailyAttendance 
            attendanceData={filteredData}
            loading={loading}
            onEditStatus={handleEditStatus}
          />
        </TabsContent>

        {/* Weekly Attendance */}
        <TabsContent value="weekly" className="space-y-4">
          <WeeklyAttendance 
            attendanceData={filteredData}
            loading={loading}
          />
        </TabsContent>

        {/* Monthly Attendance */}
        <TabsContent value="monthly" className="space-y-4">
          <MonthlyAttendance 
            attendanceData={filteredData}
            loading={loading}
          />
        </TabsContent>

        {/* Semester Attendance */}
        <TabsContent value="semester" className="space-y-4">
          <SemesterAttendance 
            attendanceData={filteredData}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}