import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

export default function SemesterAttendance({ 
  attendanceData, 
  loading 
}) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Semester Attendance Summary (Complete Semester - 4-5 Months)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Calculating semester data...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceData.length === 0 ? (
              <div className="text-center py-8">
                <div className="max-w-md mx-auto">
                  <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No semester data available yet.</p>
                  <p className="text-sm text-gray-500">
                    Semester stats are calculated from all daily attendance records throughout the 4-5 month period. 
                    Start adding daily attendance to build semester statistics.
                  </p>
                </div>
              </div>
            ) : (
              attendanceData.map((record, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-lg">{record.studentName}</p>
                      <p className="text-sm text-gray-600">{record.department}</p>
                      <p className="text-xs text-gray-500 mt-1">Complete Semester Record</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-lg">{record.attended}/{record.totalClasses}</p>
                      <p className="text-sm text-gray-600">Total Classes</p>
                      <p 
                        className="font-semibold text-lg" 
                        style={{ 
                          color: record.percentage >= 80 ? COLLEGE_COLORS.lightGreen : '#ef4444' 
                        }}
                      >
                        {record.percentage}%
                      </p>
                    </div>
                    <Badge className={getStatusColor(record.status)} variant="outline">
                      {getStatusText(record.status)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}