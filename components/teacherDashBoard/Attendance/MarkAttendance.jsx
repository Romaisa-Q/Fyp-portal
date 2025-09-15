import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Search, BarChart3 } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { Card, CardContent } from '../../ui/card.jsx';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';
import { attendanceManager } from '../../utils/attendanceStorage.js';

// Import only the period components we need
import DailyAttendance from './periods/DailyAttendance';
import SemesterAttendance from './periods/SemesterAttendance';

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
  onExport,
  classes = [], // expecting [{ id, name }]
  selectedClass,
  setSelectedClass,
  stats
}) {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load data when tab or class changes
  useEffect(() => {
    loadAttendanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedClass]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'daily') {
        const data = attendanceManager.getFilteredData('daily', selectedClass || 'all');
        setAttendanceData(data);
      } else {
        const data = attendanceManager.getPeriodData(activeTab, selectedClass || 'all');
        setAttendanceData(data);
      }
    } catch (error) {
      console.error('Error loading attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = attendanceData.filter((record) =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStatus = (recordId, newStatus) => {
    const record = attendanceData.find((r) => r.id === recordId || r.studentName === recordId);
    if (record) {
      const date = record.date || new Date().toISOString().split('T')[0];
      attendanceManager.updateAttendanceStatus(date, record.id || record.studentName, selectedClass || 'all', newStatus);
      loadAttendanceData();
      toast.success('Attendance updated successfully');
    }
  };

  const handleExport = () => {
    const csvContent = generateCSV(filteredData, activeTab);
    const filename = `attendance_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    toast.success(`Attendance data exported successfully as ${filename}`);
    if (typeof onExport === 'function') onExport();
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
                      {stats?.total ?? 0}
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
                    <p className="text-2xl font-semibold text-green-600">{stats?.present ?? 0}</p>
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
                    <p className="text-2xl font-semibold text-red-600">{stats?.absent ?? 0}</p>
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
                      {stats?.percentage ?? 0}%
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
                      {stats?.totalStudents ?? 0}
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
                      {stats?.averageAttendance ?? 0}%
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
                    <p className="text-2xl font-semibold text-green-600">{stats?.excellent ?? 0}</p>
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
                    <p className="text-2xl font-semibold text-red-600">{stats?.warning ?? 0}</p>
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

        <Select value={selectedClass || 'all'} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Tabs (only Daily & Semester) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily</TabsTrigger>
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
