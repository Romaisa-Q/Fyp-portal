import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Edit2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';

export default function DailyAttendance({ 
  attendanceData, 
  loading, 
  onEditStatus 
}) {
  const [editingRecord, setEditingRecord] = useState(null);

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

  const handleEditStatus = (recordId, newStatus) => {
    onEditStatus(recordId, newStatus);
    setEditingRecord(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Attendance - {new Date().toLocaleDateString()}
        </CardTitle>
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
              attendanceData.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-medium">{record.studentName}</p>
                      <p className="text-sm text-gray-600">{record.department} • {record.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      By: {record.markedBy}
                    </span>
                    
                    {editingRecord === record.id ? (
                      <div className="flex items-center gap-2">
                        <Select 
                          value={record.status} 
                          onValueChange={(value) => handleEditStatus(record.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingRecord(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusText(record.status)}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingRecord(record.id)}
                          title="Edit attendance status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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