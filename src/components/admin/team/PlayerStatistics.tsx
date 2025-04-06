import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { TeamMember } from '@/services/teamService';
import { updateTeamMember } from '@/services/teamDbService';
import { useTeamStore } from '@/services/teamService';

interface PlayerStatisticsProps {
  player: TeamMember;
}

const PlayerStatistics: React.FC<PlayerStatisticsProps> = ({ player }) => {
  const [editing, setEditing] = useState(false);
  const [matchesPlayed, setMatchesPlayed] = useState<number>(player.matches_played || 0);
  const [goalsScored, setGoalsScored] = useState<number>(player.goals_scored || 0);
  const [assists, setAssists] = useState<number>(player.assists || 0);
  const [yellowCards, setYellowCards] = useState<number>(player.yellow_cards || 0);
  const [redCards, setRedCards] = useState<number>(player.red_cards || 0);
  const [position, setPosition] = useState<string>(player.position || '');
  const { loadTeamMembers } = useTeamStore();

  const positions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward"
  ];

  useEffect(() => {
    setMatchesPlayed(player.matches_played || 0);
    setGoalsScored(player.goals_scored || 0);
    setAssists(player.assists || 0);
    setYellowCards(player.yellow_cards || 0);
    setRedCards(player.red_cards || 0);
    setPosition(player.position || '');
  }, [player]);

  const handleSave = async () => {
    try {
      // Validate numeric inputs
      if (isNaN(matchesPlayed) || isNaN(goalsScored) || isNaN(assists) || isNaN(yellowCards) || isNaN(redCards)) {
        toast.error("Please enter valid numbers for statistics");
        return;
      }

      // Update player statistics
      const updatedPlayer = {
        ...player,
        matches_played: Number(matchesPlayed),
        goals_scored: Number(goalsScored),
        assists: Number(assists),
        yellow_cards: Number(yellowCards),
        red_cards: Number(redCards),
        position: position,
      };

      await updateTeamMember(updatedPlayer);
      await loadTeamMembers();
      toast.success("Player statistics updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Error updating player statistics:", error);
      toast.error("Failed to update player statistics");
    }
  };

  const handleCancel = () => {
    setMatchesPlayed(player.matches_played || 0);
    setGoalsScored(player.goals_scored || 0);
    setAssists(player.assists || 0);
    setYellowCards(player.yellow_cards || 0);
    setRedCards(player.red_cards || 0);
    setPosition(player.position || '');
    setEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {player.name} Statistics
        </CardTitle>
        {editing ? (
          <div className="space-x-2">
            <Button variant="ghost" onClick={handleCancel}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Statistics
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Statistic</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Matches Played</TableCell>
              <TableCell>
                {editing ? (
                  <Input
                    type="number"
                    value={matchesPlayed}
                    onChange={(e) => setMatchesPlayed(Number(e.target.value))}
                  />
                ) : (
                  matchesPlayed
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Goals Scored</TableCell>
              <TableCell>
                {editing ? (
                  <Input
                    type="number"
                    value={goalsScored}
                    onChange={(e) => setGoalsScored(Number(e.target.value))}
                  />
                ) : (
                  goalsScored
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Assists</TableCell>
              <TableCell>
                {editing ? (
                  <Input
                    type="number"
                    value={assists}
                    onChange={(e) => setAssists(Number(e.target.value))}
                  />
                ) : (
                  assists
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Yellow Cards</TableCell>
              <TableCell>
                {editing ? (
                  <Input
                    type="number"
                    value={yellowCards}
                    onChange={(e) => setYellowCards(Number(e.target.value))}
                  />
                ) : (
                  yellowCards
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Red Cards</TableCell>
              <TableCell>
                {editing ? (
                  <Input
                    type="number"
                    value={redCards}
                    onChange={(e) => setRedCards(Number(e.target.value))}
                  />
                ) : (
                  redCards
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>
                {editing ? (
                  <Select onValueChange={setPosition} defaultValue={position}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  position
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlayerStatistics;
