import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../ui/card';

export default function ReportsStats({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Present</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Absent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance %</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">{stats.attendancePercentage}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
