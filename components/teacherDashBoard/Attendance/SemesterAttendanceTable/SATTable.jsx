import { Card, CardContent } from "../../../ui/card";

// helper functions
const formatDate = (dateString) => {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const getDayOfWeek = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", { weekday: "short" });
};

export default function SATTable({ filteredStudents, currentMonthDates, currentMonth, currentYear }) {
  if (filteredStudents.length === 0) {
    return <p className="text-center py-6">No students found for the selected filters.</p>;
  }

  return (
    <Card>
      <CardContent className="overflow-auto">
        <table className="min-w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border px-2 py-1">Student Name</th>
              <th className="border px-2 py-1">Department</th>
              <th className="border px-2 py-1">Semester</th>
              {currentMonthDates.map((date, idx) => (
                <th key={idx} className="border px-2 py-1 text-center">
                  {formatDate(date)}
                  <br />
                  <span className="text-xs">{getDayOfWeek(date)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr key={idx} className="hover:bg-muted/50">
                <td className="border px-2 py-1">{student.name}</td>
                <td className="border px-2 py-1">{student.department}</td>
                <td className="border px-2 py-1">{student.semester}</td>
                {currentMonthDates.map((date, dIdx) => (
                  <td
                    key={dIdx}
                    className={`border px-2 py-1 text-center ${
                      student.attendance[date] === "Present"
                        ? "bg-green-100 text-green-800"
                        : student.attendance[date] === "Absent"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }`}
                  >
                    {student.attendance[date] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
