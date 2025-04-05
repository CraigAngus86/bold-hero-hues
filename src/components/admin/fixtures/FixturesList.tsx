
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ScrapedFixture } from "@/types/fixtures";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface FixturesListProps {
  fixtures: ScrapedFixture[];
  onExport: () => void;
}

const FixturesList = ({ fixtures, onExport }: FixturesListProps) => {
  if (!fixtures || fixtures.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {fixtures.length} {fixtures.length === 1 ? "Fixture" : "Fixtures"} Found
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="text-xs"
        >
          <Download className="h-3.5 w-3.5 mr-1" /> Export
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Home Team</TableHead>
              <TableHead>Away Team</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fixtures.map((fixture, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {fixture.date ? format(parseISO(fixture.date), "dd MMM yyyy") : "Unknown"}
                  <span className="ml-1 text-gray-500">{fixture.time}</span>
                </TableCell>
                <TableCell>
                  <span className={fixture.homeTeam.toLowerCase().includes("banks o'") ? "font-semibold text-team-blue" : ""}>
                    {fixture.homeTeam}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={fixture.awayTeam.toLowerCase().includes("banks o'") ? "font-semibold text-team-blue" : ""}>
                    {fixture.awayTeam}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={fixture.isCompleted ? "default" : "outline"}>
                    {fixture.isCompleted ? "Completed" : "Upcoming"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {fixture.isCompleted && fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
                    <span className="font-semibold">
                      {fixture.homeScore} - {fixture.awayScore}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FixturesList;
