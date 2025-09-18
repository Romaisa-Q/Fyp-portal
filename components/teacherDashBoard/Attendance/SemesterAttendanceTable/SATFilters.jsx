import { Card, CardContent } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";

export default function SATFilters({
  selectedDepartment,
  setSelectedDepartment,
  selectedSemester,
  setSelectedSemester,
  departments,
  semesters,
}) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-4">
        {/* Department Filter */}
        <div className="flex-1">
          <Label>Department</Label>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept, idx) => (
                <SelectItem key={idx} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester Filter */}
        <div className="flex-1">
          <Label>Semester</Label>
          <Select
            value={selectedSemester}
            onValueChange={setSelectedSemester}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((sem, idx) => (
                <SelectItem key={idx} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
