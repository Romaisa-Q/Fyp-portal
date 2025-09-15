import { useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';

export default function DailyAttendance({ 
  attendanceData, 
  loading, 
  onEditStatus 
}) {
  const [updatedAttendance, setUpdatedAttendance] = useState({});

  const handleCheckboxChange = (recordId, isChecked) => {
    const newStatus = isChecked ? 'present' : 'absent';
    setUpdatedAttendance((prev) => ({
      ...prev,
      [recordId]: newStatus
    }));
    onEditStatus(recordId, newStatus);
  };

  const handleMarkAll = (status) => {
    const newUpdates = {};
    attendanceData.forEach((record) => {
      newUpdates[record.id] = status;
      onEditStatus(record.id, status);
    });
    setUpdatedAttendance(newUpdates);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Title */}
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Attendance - {new Date().toLocaleDateString()}
          </CardTitle>

          {/* Buttons */}
          {attendanceData.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleMarkAll('present')}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-sm 
                           hover:bg-gray-100 active:bg-gray-200 transition"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('absent')}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-sm 
                           hover:bg-gray-100 active:bg-gray-200 transition"
              >
                Mark All Absent
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading attendance data...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No attendance data for today. Click "Sync Daily Data" to fetch from API.</p>
              </div>
            ) : (
              attendanceData.map((record) => {
                const currentStatus = updatedAttendance[record.id] || record.status;
                return (
                  <div 
                    key={record.id} 
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(currentStatus)}
                      <div>
                        <p className="font-medium">{record.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {record.department} • {record.subject}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={currentStatus === 'present'}
                          onChange={(e) =>
                            handleCheckboxChange(record.id, e.target.checked)
                          }
                        />
                        Mark Present
                      </label>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
