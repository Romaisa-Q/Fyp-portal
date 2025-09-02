import { CheckCircle, XCircle, Edit2, X } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { COLLEGE_COLORS } from '../../../constants/colors';

export default function DailyAttendance({
  data = [],
  loading = false,
  editingRecord,
  setEditingRecord,
  handleEditStatus,
  getStatusIcon,
  getStatusColor,
  getStatusText
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
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
            {data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No attendance data for today. Click "Sync Daily Data" to fetch from API.
                </p>
              </div>
            ) : (
              data.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-medium">{record.studentName}</p>
                      <p className="text-sm text-gray-600">
                        {record.department} • {record.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">By: {record.markedBy}</span>
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
