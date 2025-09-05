import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';

export default function MonthlyAttendance({ 
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
          <Calendar className="w-5 h-5" />
          Monthly Attendance Summary (Current Month)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Calculating monthly data...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No monthly data available. Monthly stats are calculated from daily attendance records.</p>
              </div>
            ) : (
              attendanceData.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{record.studentName}</p>
                      <p className="text-sm text-gray-600">{record.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{record.attended}/{record.totalClasses} classes</p>
                      <p className="text-sm text-gray-600">{record.percentage}% attendance</p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
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