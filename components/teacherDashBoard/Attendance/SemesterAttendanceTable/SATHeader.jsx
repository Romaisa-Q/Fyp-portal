import { ArrowLeft, FileDown } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardHeader, CardTitle } from "../../../ui/card";

export default function SATHeader({ onBack, currentMonth, currentYear, filteredStudents, currentMonthDates }) {
  // Export data to CSV
  const handleExport = () => {
    const csvContent = [
      ["Student Name", "Department", "Semester", ...currentMonthDates],
      ...filteredStudents.map(student => [
        student.name,
        student.department,
        student.semester,
        ...currentMonthDates.map(date => student.attendance[date] || "N/A"),
      ]),
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${currentMonth + 1}_${currentYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Semester Attendance Report</CardTitle>
        </div>
        <Button onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </CardHeader>
    </Card>
  );
}
