import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table';

export default function ReportsTable({ showDailyAttendance, dailyAttendance, semesterAttendance, getSemesterRange }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>
          {showDailyAttendance ? "Daily Attendance" : `Semester Attendance (${getSemesterRange()})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(showDailyAttendance ? dailyAttendance : semesterAttendance).map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.studentName}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
