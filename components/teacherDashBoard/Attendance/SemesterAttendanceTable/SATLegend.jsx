import { Card, CardContent } from "../../../ui/card";

export default function SATLegend() {
  return (
    <Card>
      <CardContent className="p-4 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-green-100 border border-green-400"></span>
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-red-100 border border-red-400"></span>
          <span className="text-sm">Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-blue-100 border border-blue-400"></span>
          <span className="text-sm">Good Attendance (&gt;75%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-yellow-100 border border-yellow-400"></span>
          <span className="text-sm">Warning (&lt;75%)</span>
        </div>
      </CardContent>
    </Card>
  );
}
