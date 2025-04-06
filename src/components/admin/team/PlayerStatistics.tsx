
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { TeamMember } from '@/types/team';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface PlayerStatisticsProps {
  player: TeamMember;
  onBack: () => void;
}

const PlayerStatistics: React.FC<PlayerStatisticsProps> = ({ player, onBack }) => {
  // Sample stats data for visualization
  const sampleStats = [
    { category: 'Goals', value: player.stats?.goals || Math.floor(Math.random() * 15) },
    { category: 'Assists', value: player.stats?.assists || Math.floor(Math.random() * 12) },
    { category: 'Appearances', value: player.stats?.appearances || Math.floor(Math.random() * 30) + 10 },
    { category: 'Minutes', value: player.stats?.minutes || Math.floor(Math.random() * 2000) + 500 },
    { category: 'Yellow Cards', value: player.stats?.yellowCards || Math.floor(Math.random() * 8) },
    { category: 'Red Cards', value: player.stats?.redCards || Math.floor(Math.random() * 2) },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>{player.name} - Statistics</CardTitle>
        </div>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Update Stats
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold">Season</h3>
              <p className="text-3xl font-bold">2023/24</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold">Appearances</h3>
              <p className="text-3xl font-bold">{sampleStats[2].value}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold">Goals</h3>
              <p className="text-3xl font-bold">{sampleStats[0].value}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleStats}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Performance Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {sampleStats.map(stat => (
                  <tr key={stat.category} className="border-b">
                    <td className="py-2 font-medium">{stat.category}</td>
                    <td className="py-2 text-right">{stat.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Player Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Position:</span> {player.position}
              </div>
              <div>
                <span className="font-medium">Nationality:</span> {player.nationality}
              </div>
              <div>
                <span className="font-medium">Jersey Number:</span> {player.jersey_number}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  player.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {player.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStatistics;
