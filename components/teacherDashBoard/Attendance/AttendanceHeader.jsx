import { RefreshCw, Download, BarChart3 } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function AttendanceHeader({ 
  activeTab = 'daily', 
  loading = false, 
  attendanceData = [], 
  onFetchNewData = () => {}, 
  onExport = () => {}, 
  reportsOpen = false, 
  setReportsOpen = () => {},
  stats = {},
  selectedDepartment = 'all'
}) {
  const getReportsData = () => {
    const chartData = [];
    const pieData = [];
    const trendData = [];

    // Ensure attendanceData is an array and handle undefined/null cases
    const safeAttendanceData = Array.isArray(attendanceData) ? attendanceData : [];

    if (activeTab === 'daily') {
      const statusCounts = {
        present: safeAttendanceData.filter((r) => r && r.status === 'present').length,
        absent: safeAttendanceData.filter((r) => r && r.status === 'absent').length,
      };

      chartData.push({ name: 'Present', count: statusCounts.present, color: '#22c55e' });
      chartData.push({ name: 'Absent', count: statusCounts.absent, color: '#ef4444' });
      
      pieData.push({ name: 'Present', value: statusCounts.present, fill: '#22c55e' });
      pieData.push({ name: 'Absent', value: statusCounts.absent, fill: '#ef4444' });

      // Generate trend data for last 5 days
      const today = new Date();
      for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        trendData.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          attendance: Math.floor(Math.random() * 20) + 80 // Mock data
        });
      }
    } else {
      const excellentCount = safeAttendanceData.filter((r) => r && r.status === 'excellent').length;
      const goodCount = safeAttendanceData.filter((r) => r && r.status === 'good').length;
      const warningCount = safeAttendanceData.filter((r) => r && r.status === 'warning').length;

      chartData.push({ name: 'Excellent (90%+)', count: excellentCount, color: '#22c55e' });
      chartData.push({ name: 'Good (80-89%)', count: goodCount, color: '#f59e0b' });
      chartData.push({ name: 'Need Attention (<80%)', count: warningCount, color: '#ef4444' });

      pieData.push({ name: 'Excellent', value: excellentCount, fill: '#22c55e' });
      pieData.push({ name: 'Good', value: goodCount, fill: '#f59e0b' });
      pieData.push({ name: 'Warning', value: warningCount, fill: '#ef4444' });
    }

    return { chartData, pieData, trendData };
  };

  const { chartData, pieData, trendData } = getReportsData();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Attendance Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Track and manage student attendance with automatic calculation & teacher control
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {activeTab === 'daily' && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={onFetchNewData} 
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
            Sync Daily Data
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={onExport} 
          disabled={!Array.isArray(attendanceData) || attendanceData.length === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        
        <Dialog open={reportsOpen} onOpenChange={setReportsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Attendance Reports - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                      {Array.isArray(attendanceData) ? attendanceData.length : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Records</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-green-600">
                      {activeTab === 'daily' ? (stats.percentage || 0) : (stats.averageAttendance || 0)}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {activeTab === 'daily' ? "Today's Rate" : 'Average Rate'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-blue-600">
                      {selectedDepartment === 'all' ? 'All Departments' : selectedDepartment.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Filter Applied</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Trend Chart (for daily view) */}
              {activeTab === 'daily' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Attendance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                        <Line
                          type="monotone"
                          dataKey="attendance"
                          stroke={COLLEGE_COLORS.lightGreen}
                          strokeWidth={2}
                          dot={{ fill: COLLEGE_COLORS.darkGreen, strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setReportsOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={onExport} 
                  className="text-white" 
                  style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report Data
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}