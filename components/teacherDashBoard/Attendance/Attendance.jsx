// src/pages/Attendance/Attendance.jsx
// Root Attendance page — loads teacher classes (mock API), manages section (Mark / Reports)
// and wires selectedClass into MarkAttendance and AttendanceReports components.

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { attendanceManager } from '../../utils/attendanceStorage.js';
import * as mockApi from '../../utils/mockApi.js';
import MarkAttendance from './MarkAttendance';
import AttendanceReports from './AttendanceReports.jsx';
import { ClipboardList, BarChart3, RefreshCw } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { Button } from '../../ui/button';

export default function Attendance({ onFetchNewData = () => {} }) {
  const [activeSection, setActiveSection] = useState('mark'); // 'mark' | 'reports'
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'semester'
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  // classes (combined department + semester) loaded from mockApi
  const [classes, setClasses] = useState([]); // [{ id: 'CS-1', name: 'CS 1' }, ...]
  const [selectedClass, setSelectedClass] = useState('all'); // 'all' or classId

  // Load available classes for the teacher (mock API)
  useEffect(() => {
    (async () => {
      try {
        const cls = await mockApi.getTeacherClasses();
        setClasses(cls);
      } catch (err) {
        console.error('Failed to load classes from mock API', err);
        toast.error('Failed to load classes');
      }
    })();
  }, []);

  // Load attendance data when activeTab or selectedClass changes
  useEffect(() => {
    loadAttendanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedClass]);

const loadAttendanceData = async () => {
  setLoading(true);
  try {
    const classId = (selectedClass === 'all' || !selectedClass) ? 'all' : selectedClass;

    if (activeTab === 'daily') {
      // always get UI-ready rows
      let data = attendanceManager.getFilteredData('daily', classId);

      // fallback if empty
      if ((!Array.isArray(data) || data.length === 0) && classId !== 'all') {
        const today = new Date().toISOString().split('T')[0];
        const rec = attendanceManager.getDailyRecord(today, classId);
        if (rec && Array.isArray(rec.data)) {
          data = rec.data.map(s => ({
            id: s.id,
            studentName: s.studentName,
            department: `${s.department}-${s.semester}`,
            subject: s.subject || '',
            status: s.present ? 'present' : 'absent',
            markedBy: 'teacher',
            date: rec.date
          }));
        }
      }

      setAttendanceData(Array.isArray(data) ? data : []);
    } else {
      // aggregated weekly/monthly/semester
      const periodData = attendanceManager.getPeriodData(activeTab, classId);
      setAttendanceData(Array.isArray(periodData) ? periodData : []);
    }
  } catch (error) {
    console.error('Error loading attendance data:', error);
    toast.error('Failed to load attendance data');
  } finally {
    setLoading(false);
  }
};

  // Fetch daily attendance coming from student-side API (mock). This is optional and kept for compatibility.
  const fetchNewDailyData = async () => {
    setLoading(true);
    try {
      const apiData = await mockApi.fetchDailyAttendanceFromStudentApi(); // dummy student-side API
      const processedData = attendanceManager.processDailyAttendance(apiData);
      // processDailyAttendance returns the UI data for the first class; refresh view explicitly
      await loadAttendanceData();
      toast.success('Daily attendance data updated from student API!');
      try {
        if (typeof onFetchNewData === 'function') onFetchNewData();
      } catch (err) {
        console.warn('onFetchNewData threw error:', err);
      }
      return processedData;
    } catch (error) {
      console.error('Error fetching daily data:', error);
      toast.error('Failed to fetch daily attendance');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Provide stats for overview cards. For daily we pass classId, for other periods pass undefined (reports will handle).
  const stats = attendanceManager.getAttendanceStats(activeTab, selectedClass === 'all' ? undefined : selectedClass);

  // Called by DailyAttendance child to update a single student's attendance
  const handleEditStatus = (recordId, newStatus) => {
    // attendanceData items for daily include date property
    const record = attendanceData.find((r) => r.id === recordId);
    if (record) {
      const date = record.date || new Date().toISOString().split('T')[0];
      // attendanceManager.updateAttendanceStatus(date, studentName, classId, newStatus)
     attendanceManager.updateAttendanceStatus(date, record.id, selectedClass, newStatus);
      // refresh view
      loadAttendanceData();
      toast.success('Attendance updated successfully');
    } else {
      // If record not found (edge case), try to update via saved daily record directly (no-op otherwise)
      const today = new Date().toISOString().split('T')[0];
      const success = attendanceManager.updateAttendanceStatus(today, recordId, selectedClass, newStatus);
      if (success) {
        loadAttendanceData();
        toast.success('Attendance updated successfully');
      } else {
        console.warn('Could not find record to update:', recordId);
      }
    }
  };

  // Export handler - not implemented here (MarkAttendance handles export via prop)
  const handleExport = () => {
    // intentionally left blank; MarkAttendance has export capability
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Attendance Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage student attendance with automatic calculation & teacher control
          </p>
        </div>

        {/* Section navigation + quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={activeSection === 'mark' ? 'default' : 'outline'}
            className="flex items-center gap-2"
            onClick={() => setActiveSection('mark')}
          >
            <ClipboardList className="w-4 h-4" />
            Mark Attendance
          </Button>

          <Button
            variant={activeSection === 'reports' ? 'default' : 'outline'}
            className="flex items-center gap-2"
            onClick={() => setActiveSection('reports')}
          >
            <BarChart3 className="w-4 h-4" />
            Reports
          </Button>

          {activeTab === 'daily' && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={fetchNewDailyData}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" />
              Sync Daily Data
            </Button>
          )}
        </div>
      </div>

      {/* Section content */}
      {activeSection === 'mark' && (
        <MarkAttendance
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          attendanceData={attendanceData}
          loading={loading}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          classes={classes}
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

