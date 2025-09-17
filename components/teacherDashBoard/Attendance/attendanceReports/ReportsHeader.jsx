// components/AttendanceReports/ReportsHeader.jsx
import { Download } from 'lucide-react';
import { Button } from '../../../ui/button';
import { COLLEGE_COLORS } from '../../../constants/colors';

export default function ReportsHeader({ getPeriodTitle, handleExport, filteredData }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Attendance Reports
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {getPeriodTitle()} attendance analytics and insights
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExport}
          disabled={filteredData.length === 0}
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
