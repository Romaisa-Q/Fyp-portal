import { Card, CardContent } from "../../../ui/card";

export default function SATStats({ filteredStudents = [], currentMonthDates = [] }) {
  // Initialize counts
  const totalStudents = filteredStudents.length;
  const totalDays = currentMonthDates.length;

  let presentCount = 0;
  let absentCount = 0;

  filteredStudents.forEach(student => {
    currentMonthDates.forEach(date => {
      // Optional chaining for safety
      const status = student.attendanceRecord?.[date];

      if (status === "P") presentCount++;
      if (status === "A") absentCount++;
    });
  });

  const avgAttendance = totalStudents > 0 && totalDays > 0
    ? ((presentCount / (totalStudents * totalDays)) * 100).toFixed(1)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Total Students</div>
          <div className="text-2xl font-bold">{totalStudents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Present Days</div>
          <div className="text-2xl font-bold">{presentCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Absent Days</div>
          <div className="text-2xl font-bold">{absentCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Avg Attendance %</div>
          <div className="text-2xl font-bold">{avgAttendance}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
