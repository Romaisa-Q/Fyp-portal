import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';

export default function ReportsFilters({
  selectedPeriod,
  setSelectedPeriod,
  selectedDepartment,
  setSelectedDepartment,
  setShowDailyAttendance,
  getSemesterRange
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Period Filter */}
      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="semester">Semester</SelectItem>
        </SelectContent>
      </Select>

      {/* Department Filter */}
      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="Computer Science">Computer Science</SelectItem>
          <SelectItem value="Business">Business</SelectItem>
          <SelectItem value="Engineering">Engineering</SelectItem>
          <SelectItem value="Arts">Arts</SelectItem>
        </SelectContent>
      </Select>

      {/* Daily Attendance Button */}
      <Button
        variant="outline"
        onClick={() => setShowDailyAttendance(true)}
      >
        View Daily Attendance ({getSemesterRange()})
      </Button>
    </div>
  );
}
