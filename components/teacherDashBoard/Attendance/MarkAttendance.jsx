import { useState, useEffect } from 'react';
import { Search, RefreshCw, Download, CheckCircle, XCircle } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';
import { attendanceManager } from '../../utils/attendanceStorage';

// Period components
import DailyAttendance from './periods/DailyAttendance';
import WeeklyAttendance from './periods/WeeklyAttendance';
import MonthlyAttendance from './periods/MonthlyAttendance';
import SemesterAttendance from './periods/SemesterAttendance';

// Reports modal (shared)
import AttendanceReports from './AttendanceReports';

// ---------------- Helper Functions ----------------
const getStatusColor = (status) => {
  switch (status) {
    case 'present':
    case 'excellent':
      return 'bg-green-100 text-green-800';
    case 'absent':
    case 'warning':
      return 'bg-red-100 text-red-800';
    case 'good':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'excellent':
      return 'Excellent (90%+)';
    case 'good':
      return 'Good (80-89%)';
    case 'warning':
      return 'Need Attention (<80%)';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'present':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'absent':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

export default function MarkAttendance() {
  const [activeTab, setActiveTab] = useState('daily');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [reportsOpen, setReportsOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Load data when tab or department changes
  useEffect(() => {
    loadAttendanceData();
  }, [activeTab, selectedDepartment]);

  const loadAttendanceData = () => {
    setLoading(true);
    try {
      const data = attendanceManager.getFilteredData(activeTab, selectedDepartment);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewDailyData = async () => {
    setLoading(true);
    try {
      const apiData = await attendanceManager.fetchDailyFromAPI();
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

  const handleEditStatus = (recordId, newStatus) => {
    const record = attendanceData.find((r) => r.id === recordId);
    if (record) {
      const date = record.date || new Date().toISOString().split('T')[0];
      attendanceManager.updateAttendanceStatus(date, record.studentName, record.department, newStatus);
      loadAttendanceData();
      setEditingRecord(null);
      toast.success('Attendance updated successfully');
    }
  };

  const handleExport = () => {
    const csvContent = attendanceManager.generateCSV(attendanceData, activeTab);
    const filename = `attendance_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    attendanceManager.downloadCSV(csvContent, filename);
    toast.success(`Attendance data exported as ${filename}`);
  };

  const filteredData = attendanceData.filter((record) =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {activeTab === 'daily' && (
          <Button variant="outline" onClick={fetchNewDailyData} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Daily Data
          </Button>
        )}
        <Button variant="outline" onClick={handleExport} disabled={attendanceData.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => setReportsOpen(true)}>
          Reports
        </Button>
      </div>

      {/* Filters */}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="semester">Semester</TabsTrigger>
        </TabsList>

        {/* Period Components */}
        <TabsContent value="daily">
          <DailyAttendance
            data={filteredData}
            loading={loading}
            editingRecord={editingRecord}
            setEditingRecord={setEditingRecord}
            handleEditStatus={handleEditStatus}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyAttendance
            data={filteredData}
            loading={loading}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </TabsContent>
        <TabsContent value="monthly">
          <MonthlyAttendance
            data={filteredData}
            loading={loading}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </TabsContent>
        <TabsContent value="semester">
          <SemesterAttendance
            data={filteredData}
            loading={loading}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </TabsContent>
      </Tabs>

      {/* Reports Modal */}
      {reportsOpen && (
        <AttendanceReports
          period={activeTab}
          data={filteredData}
          onClose={() => setReportsOpen(false)}
        />
      )}
    </div>
  );
}

