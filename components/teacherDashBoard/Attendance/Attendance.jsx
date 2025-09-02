import { useState, useEffect } from 'react';
import MarkAttendance from './MarkAttendance';
import AttendanceReports from './AttendanceReports';
import { COLLEGE_COLORS } from '../../constants/colors';

export default function Attendance({ defaultSection = 'mark' }) {
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection]);

  return (
    <div className="space-y-6">
      {/* ✅ Original header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: COLLEGE_COLORS.darkGreen }}
          >
            Attendance Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage student attendance with automatic calculation & teacher control
          </p>
        </div>
      </div>

      {/* ✅ Section switch */}
      {activeSection === 'mark' && <MarkAttendance />} 
      {activeSection === 'reports' && <AttendanceReports />}
    </div>
  );
}
