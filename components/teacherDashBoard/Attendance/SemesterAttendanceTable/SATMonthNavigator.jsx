import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";

export default function SATMonthNavigator({ currentMonth, currentYear, setCurrentMonth, setCurrentYear }) {
  // Month names
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Previous month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <Button variant="outline" onClick={handlePrevMonth}>
          Previous Month
        </Button>
        <span className="font-medium">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <Button variant="outline" onClick={handleNextMonth}>
          Next Month
        </Button>
      </CardContent>
    </Card>
  );
}
