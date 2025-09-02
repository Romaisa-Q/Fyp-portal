import { useState, useEffect } from 'react';
import MarkAttendance from './MarkAttendance';
import AttendanceReports from './AttendanceReports';
import { COLLEGE_COLORS } from '../../constants/colors';
 import { Download, BarChart3 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
// import { COLLEGE_COLORS } from '../../constants/colors';

export default function Attendance({ defaultSection = 'mark'  , stats,
  onExport,
  onReports }) {
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection]);

  return (
    <div className="space-y-6">
      {/* ✅ Original header */}
      {/* Top title + buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: COLLEGE_COLORS.darkGreen }}
          >
            Attendance Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage student attendance with automatic calculation & teacher control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onExport}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onReports}
          >
            <BarChart3 className="w-4 h-4" />
            Reports
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-md border-l-4" style={{ borderColor: COLLEGE_COLORS.darkGreen }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: COLLEGE_COLORS.darkGreen }}>
              {stats.totalStudents}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Students</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-l-4 border-blue-500">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.averageAttendance}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Average Attendance</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-l-4 border-green-500">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.excellent}
            </div>
            <div className="text-sm text-gray-600 mt-1">Excellent (90%+)</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-l-4 border-red-500">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.warning}
            </div>
            <div className="text-sm text-gray-600 mt-1">Need Attention (&lt;80%)</div>
          </CardContent>
        </Card>
      </div>
      {/* ✅ Section switch */}
      {activeSection === 'mark' && <MarkAttendance />}
      {activeSection === 'reports' && <AttendanceReports />}
    </div>
  );
}
