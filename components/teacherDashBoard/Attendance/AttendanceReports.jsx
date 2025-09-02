import { BarChart3, Download } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function AttendanceReports({ period = 'daily', data = [], onClose }) {
  // Chart data prepare
  const chartData = [];
  const pieData = [];
  const trendData = [];

  if (period === 'daily') {
    const presentCount = data.filter(r => r.status === 'present').length;
    const absentCount = data.filter(r => r.status === 'absent').length;

    chartData.push({ name: 'Present', count: presentCount, color: '#22c55e' });
    chartData.push({ name: 'Absent', count: absentCount, color: '#ef4444' });

    pieData.push({ name: 'Present', value: presentCount, fill: '#22c55e' });
    pieData.push({ name: 'Absent', value: absentCount, fill: '#ef4444' });

    // Dummy trend data (replace with real if needed)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    days.forEach(day => {
      trendData.push({ day, attendance: Math.floor(Math.random() * 100) });
    });
  } else {
    const excellentCount = data.filter(r => r.status === 'excellent').length;
    const goodCount = data.filter(r => r.status === 'good').length;
    const warningCount = data.filter(r => r.status === 'warning').length;

    chartData.push({ name: 'Excellent (90%+)', count: excellentCount, color: '#22c55e' });
    chartData.push({ name: 'Good (80-89%)', count: goodCount, color: '#f59e0b' });
    chartData.push({ name: 'Need Attention (<80%)', count: warningCount, color: '#ef4444' });

    pieData.push({ name: 'Excellent', value: excellentCount, fill: '#22c55e' });
    pieData.push({ name: 'Good', value: goodCount, fill: '#f59e0b' });
    pieData.push({ name: 'Warning', value: warningCount, fill: '#ef4444' });
  }

  const handleExport = () => {
    // Export logic yahan aa sakta hai
    console.log('Exporting report data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Attendance Reports - {period.charAt(0).toUpperCase() + period.slice(1)}
        </h2>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
              {data.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-green-600">
              {period === 'daily' ? 'Today\'s Rate' : 'Average Rate'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Attendance Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-blue-600">
              {period.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 mt-1">View Type</div>
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

      {/* Trend Chart (Daily only) */}
      {period === 'daily' && (
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
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleExport} className="text-white" style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}>
          <Download className="w-4 h-4 mr-2" />
          Export Report Data
        </Button>
      </div>
    </div>
  );
}
