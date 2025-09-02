// Attendance Data Management System
// Handles daily API data and calculates weekly, monthly, semester statistics

export class AttendanceManager {
  constructor() {
    this.storageKey = 'attendance_data';
    this.semesterKey = 'semester_config';

    // ✅ Only initialize in browser
    if (typeof window !== 'undefined') {
      this.initializeStorage();
    }
  }
  // AttendanceManager class ke andar add karo:
async fetchDailyFromAPI() {
  // ✅ Sirf browser me chale
  if (typeof window === 'undefined') return [];

  try {
    // Yahan tum apna real API endpoint call kar sakti ho
    // Example dummy data:
    return [
      {
        id: 1,
        studentName: 'Ali Khan',
        department: 'Computer Science',
        subject: 'Math',
        status: 'present',
        markedBy: 'teacher'
      },
      {
        id: 2,
        studentName: 'Sara Ahmed',
        department: 'Software Engineering',
        subject: 'Physics',
        status: 'absent',
        markedBy: 'teacher'
      }
    ];

    // Agar real API call karni ho:
    // const res = await fetch('/api/attendance/daily');
    // return await res.json();

  } catch (error) {
    console.error('Error fetching daily attendance from API:', error);
    return [];
  }
}


  initializeStorage() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        daily: {},
        students: {},
        semester: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: this.calculateSemesterEnd(),
          totalWeeks: 20,
          currentWeek: 1
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  calculateSemesterEnd() {
    const start = new Date();
    start.setMonth(start.getMonth() + 4);
    return start.toISOString().split('T')[0];
  }

  getData() {
    if (typeof window === 'undefined') return { daily: {}, students: {} };
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  saveData(data) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  processDailyAttendance(apiData) {
    if (typeof window === 'undefined') return [];
    const data = this.getData();
    const today = new Date().toISOString().split('T')[0];

    data.daily[today] = apiData.map(record => ({
      id: record.id || Date.now() + Math.random(),
      studentName: record.studentName,
      department: record.department,
      subject: record.subject,
      status: record.status,
      date: today,
      markedBy: record.markedBy || 'student'
    }));

    apiData.forEach(record => {
      const studentKey = `${record.studentName}_${record.department}`;
      if (!data.students[studentKey]) {
        data.students[studentKey] = {
          studentName: record.studentName,
          department: record.department,
          attendanceHistory: {},
          totalDays: 0,
          presentDays: 0,
          semesterPercentage: 0
        };
      }
      const student = data.students[studentKey];
      student.attendanceHistory[today] = {
        status: record.status,
        subject: record.subject,
        markedBy: record.markedBy || 'student'
      };
      this.updateStudentStats(student);
    });

    this.saveData(data);
    return data.daily[today];
  }

  updateStudentStats(student) {
    const history = student.attendanceHistory;
    const totalDays = Object.keys(history).length;
    const presentDays = Object.values(history).filter(day => day.status === 'present').length;

    student.totalDays = totalDays;
    student.presentDays = presentDays;
    student.semesterPercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  }

  getDailyAttendance(date = null) {
    if (typeof window === 'undefined') return [];
    const data = this.getData();
    const targetDate = date || new Date().toISOString().split('T')[0];
    return data.daily[targetDate] || [];
  }

  getWeeklyAttendance() {
    if (typeof window === 'undefined') return [];
    const data = this.getData();
    const students = data.students;
    const today = new Date();

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);

    const weekDates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }

    const weeklyData = Object.values(students).map(student => {
      let weekTotalClasses = 0;
      let weekAttended = 0;

      weekDates.forEach(date => {
        if (student.attendanceHistory[date]) {
          weekTotalClasses++;
          if (student.attendanceHistory[date].status === 'present') {
            weekAttended++;
          }
        }
      });

      const weekPercentage = weekTotalClasses > 0 ? Math.round((weekAttended / weekTotalClasses) * 100) : 0;

      return {
        studentName: student.studentName,
        department: student.department,
        totalClasses: weekTotalClasses,
        attended: weekAttended,
        percentage: weekPercentage,
        status: this.getStatusFromPercentage(weekPercentage)
      };
    });

    return weeklyData.filter(student => student.totalClasses > 0);
  }

  getMonthlyAttendance() {
    if (typeof window === 'undefined') return [];
    const data = this.getData();
    const students = data.students;
    const today = new Date();

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyData = Object.values(students).map(student => {
      let monthTotalClasses = 0;
      let monthAttended = 0;

      for (let date = new Date(monthStart); date <= monthEnd; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        if (student.attendanceHistory[dateStr]) {
          monthTotalClasses++;
          if (student.attendanceHistory[dateStr].status === 'present') {
            monthAttended++;
          }
        }
      }

      const monthPercentage = monthTotalClasses > 0 ? Math.round((monthAttended / monthTotalClasses) * 100) : 0;

      return {
        studentName: student.studentName,
        department: student.department,
        totalClasses: monthTotalClasses,
        attended: monthAttended,
        percentage: monthPercentage,
        status: this.getStatusFromPercentage(monthPercentage)
      };
    });

    return monthlyData.filter(student => student.totalClasses > 0);
  }

  getSemesterAttendance() {
    if (typeof window === 'undefined') return [];
    const data = this.getData();
    const students = data.students;

    const semesterData = Object.values(students).map(student => ({
      studentName: student.studentName,
      department: student.department,
      totalClasses: student.totalDays,
      attended: student.presentDays,
      percentage: student.semesterPercentage,
      status: this.getStatusFromPercentage(student.semesterPercentage)
    }));

    return semesterData.filter(student => student.totalClasses > 0);
  }

  getStatusFromPercentage(percentage) {
    if (percentage < 80) return 'warning';
    if (percentage >= 80 && percentage < 90) return 'good';
    return 'excellent';
  }

  updateAttendanceStatus(date, studentName, department, newStatus) {
    if (typeof window === 'undefined') return;
    const data = this.getData();

    if (data.daily[date]) {
      const record = data.daily[date].find(r =>
        r.studentName === studentName && r.department === department
      );
      if (record) {
        record.status = newStatus;
        record.markedBy = 'teacher';
      }
    }

    const studentKey = `${studentName}_${department}`;
    if (data.students[studentKey] && data.students[studentKey].attendanceHistory[date]) {
      data.students[studentKey].attendanceHistory[date].status = newStatus;
      data.students[studentKey].attendanceHistory[date].markedBy = 'teacher';
      this.updateStudentStats(data.students[studentKey]);
    }

    this.saveData(data);
  }

  getAttendanceStats(period) {
    if (typeof window === 'undefined') return {};
    let attendanceData = [];

    switch (period) {
      case 'daily':
        attendanceData = this.getDailyAttendance();
        break;
      case 'weekly':
        attendanceData = this.getWeeklyAttendance();
        break;
      case 'monthly':
        attendanceData = this.getMonthlyAttendance();
        break;
      case 'semester':
        attendanceData = this.getSemesterAttendance();
        break;
      default:
        attendanceData = this.getDailyAttendance();
    }

    if (period === 'daily') {
      const present = attendanceData.filter(r => r.status === 'present').length;
      const absent = attendanceData.filter(r => r.status === 'absent').length;
      const total = attendanceData.length;

      return {
        total,
        present,
        absent,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0
      };
    } else {
      const totalStudents = attendanceData.length;
      const averageAttendance = attendanceData.length > 0
        ? Math.round(attendanceData.reduce((sum, record) => sum + record.percentage, 0) / attendanceData.length)
        : 0;
      return {
        totalStudents,
        averageAttendance,
        excellent: attendanceData.filter(r => r.status === 'excellent').length,
        good: attendanceData.filter(r => r.status === 'good').length,
        warning: attendanceData.filter(r => r.status === 'warning').length
      };
    }
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.initializeStorage();
  }

  // Get department-wise filtered data
  getFilteredData(period, department) {
    let data = [];
    
    switch (period) {
      case 'daily':
        data = this.getDailyAttendance();
        break;
      case 'weekly':
        data = this.getWeeklyAttendance();
        break;
      case 'monthly':
        data = this.getMonthlyAttendance();
        break;
      case 'semester':
        data = this.getSemesterAttendance();
        break;
    }

    if (department === 'all') {
      return data;
    }

    return data.filter(record => 
      record.department.toLowerCase().includes(department.toLowerCase())
    );
  }
}

// Export singleton instance
export const attendanceManager = new AttendanceManager();