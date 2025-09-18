import { useState, useEffect } from 'react';
import { getSemesterAttendanceData } from '../../../utils/helpers';
import SATHeader from './SATHeader';
import SATMonthNavigator from './SATMonthNavigator';
import SATFilters from './SATFilters';
import SATStats from './SATStats';
import SATTable from './SATTable';
import SATLegend from './SATLegend';

export default function SemesterAttendanceTable({ onBack }) {
  const [semesterData, setSemesterData] = useState({ students: [], dates: [] });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getSemesterAttendanceData();
    setSemesterData(data);
    setLoading(false);
  }, []);

  // Filter students
  const filteredStudents = semesterData.students.filter(student => {
    const departmentMatch = selectedDepartment === 'all' || student.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    const semesterMatch = selectedSemester === 'all' || student.semester.toString() === selectedSemester;
    return departmentMatch && semesterMatch;
  });

  // Filter dates
  const currentMonthDates = semesterData.dates.filter(date => {
    const d = new Date(date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Unique values for filters
  const departments = [...new Set(semesterData.students.map(s => s.department))];
  const semesters = [...new Set(semesterData.students.map(s => s.semester))].sort();

  if (loading) {
    return <p className="text-center py-10">Loading semester attendance...</p>;
  }

  return (
    <div className="space-y-6">
      <SATHeader 
        onBack={onBack}
        currentMonth={currentMonth}
        currentYear={currentYear}
        filteredStudents={filteredStudents}
        currentMonthDates={currentMonthDates}
      />

      <SATMonthNavigator 
        currentMonth={currentMonth}
        currentYear={currentYear}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />

      <SATFilters 
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        departments={departments}
        semesters={semesters}
      />

      <SATStats 
        filteredStudents={filteredStudents}
        currentMonthDates={currentMonthDates}
      />

      <SATTable 
        filteredStudents={filteredStudents}
        currentMonthDates={currentMonthDates}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      <SATLegend />
    </div>
  );
}
