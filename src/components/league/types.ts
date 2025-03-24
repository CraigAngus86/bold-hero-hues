
export interface TeamStats {
  id?: number;
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
  logo?: string;
  lastResult?: {
    opponent: string;
    result: 'W' | 'D' | 'L';
    score: string;
  };
}

export const mockLeagueData: TeamStats[] = [
  {
    position: 1,
    team: "Buckie Thistle",
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 8,
    goalDifference: 16,
    points: 25,
    form: ["W", "W", "W", "D", "W"],
    logo: "https://placehold.co/40x40/team-white/team-blue?text=BT"
  },
  {
    position: 2,
    team: "Brechin City",
    played: 10,
    won: 8,
    drawn: 0,
    lost: 2,
    goalsFor: 20,
    goalsAgainst: 7,
    goalDifference: 13,
    points: 24,
    form: ["W", "W", "W", "L", "W"],
    logo: "https://placehold.co/40x40/team-white/team-blue?text=BC"
  },
  {
    position: 3,
    team: "Banks o' Dee",
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 22,
    goalsAgainst: 10,
    goalDifference: 12,
    points: 23,
    form: ["W", "D", "W", "W", "D"],
    logo: "/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png"
  },
  {
    position: 4,
    team: "Fraserburgh",
    played: 10,
    won: 7,
    drawn: 1,
    lost: 2,
    goalsFor: 21,
    goalsAgainst: 11,
    goalDifference: 10,
    points: 22,
    form: ["L", "W", "W", "W", "W"],
    logo: "https://placehold.co/40x40/team-white/team-blue?text=FR"
  },
  {
    position: 5,
    team: "Formartine United",
    played: 10,
    won: 6,
    drawn: 1,
    lost: 3,
    goalsFor: 18,
    goalsAgainst: 12,
    goalDifference: 6,
    points: 19,
    form: ["W", "W", "L", "W", "L"],
    logo: "https://placehold.co/40x40/team-white/team-blue?text=FU"
  },
  {
    position: 6,
    team: "Huntly",
    played: 10,
    won: 5,
    drawn: 2,
    lost: 3,
    goalsFor: 15,
    goalsAgainst: 10,
    goalDifference: 5,
    points: 17,
    form: ["D", "W", "L", "W", "D"],
    logo: "https://placehold.co/40x40/team-white/team-blue?text=HU"
  }
];

// Add the full mock data for the league page
export const fullMockLeagueData: TeamStats[] = [
  {
    position: 1,
    team: "Buckie Thistle",
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 8,
    goalDifference: 16,
    points: 25,
    form: ["W", "W", "W", "D", "W"],
    lastResult: {
      opponent: "Formartine United",
      result: "W",
      score: "3-1"
    }
  },
  {
    position: 2,
    team: "Brechin City",
    played: 10,
    won: 8,
    drawn: 0,
    lost: 2,
    goalsFor: 20,
    goalsAgainst: 7,
    goalDifference: 13,
    points: 24,
    form: ["W", "W", "W", "L", "W"],
    lastResult: {
      opponent: "Huntly",
      result: "W",
      score: "2-0"
    }
  },
  {
    position: 3,
    team: "Banks o' Dee",
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 22,
    goalsAgainst: 10,
    goalDifference: 12,
    points: 23,
    form: ["W", "D", "W", "W", "D"],
    lastResult: {
      opponent: "Formartine United",
      result: "W",
      score: "3-1"
    }
  },
  {
    position: 4,
    team: "Fraserburgh",
    played: 10,
    won: 7,
    drawn: 1,
    lost: 2,
    goalsFor: 21,
    goalsAgainst: 11,
    goalDifference: 10,
    points: 22,
    form: ["L", "W", "W", "W", "W"],
    lastResult: {
      opponent: "Wick Academy",
      result: "W",
      score: "2-0"
    }
  },
  {
    position: 5,
    team: "Formartine United",
    played: 10,
    won: 6,
    drawn: 1,
    lost: 3,
    goalsFor: 18,
    goalsAgainst: 12,
    goalDifference: 6,
    points: 19,
    form: ["W", "W", "L", "W", "L"],
    lastResult: {
      opponent: "Buckie Thistle",
      result: "L",
      score: "1-3"
    }
  },
  {
    position: 6,
    team: "Huntly",
    played: 10,
    won: 5,
    drawn: 2,
    lost: 3,
    goalsFor: 15,
    goalsAgainst: 10,
    goalDifference: 5,
    points: 17,
    form: ["D", "W", "L", "W", "D"],
    lastResult: {
      opponent: "Brechin City",
      result: "L",
      score: "0-2"
    }
  },
  {
    position: 7,
    team: "Rothes",
    played: 10,
    won: 5,
    drawn: 1,
    lost: 4,
    goalsFor: 14,
    goalsAgainst: 12,
    goalDifference: 2,
    points: 16,
    form: ["W", "L", "W", "D", "L"],
    lastResult: {
      opponent: "Nairn County",
      result: "L",
      score: "1-2"
    }
  },
  {
    position: 8,
    team: "Nairn County",
    played: 10,
    won: 4,
    drawn: 3,
    lost: 3,
    goalsFor: 16,
    goalsAgainst: 15,
    goalDifference: 1,
    points: 15,
    form: ["D", "D", "W", "L", "W"],
    lastResult: {
      opponent: "Rothes",
      result: "W",
      score: "2-1"
    }
  },
  {
    position: 9,
    team: "Keith",
    played: 10,
    won: 4,
    drawn: 2,
    lost: 4,
    goalsFor: 13,
    goalsAgainst: 16,
    goalDifference: -3,
    points: 14,
    form: ["W", "L", "D", "W", "L"],
    lastResult: {
      opponent: "Lossiemouth",
      result: "L",
      score: "1-2"
    }
  },
  {
    position: 10,
    team: "Wick Academy",
    played: 10,
    won: 4,
    drawn: 1,
    lost: 5,
    goalsFor: 12,
    goalsAgainst: 13,
    goalDifference: -1,
    points: 13,
    form: ["L", "W", "W", "L", "L"],
    lastResult: {
      opponent: "Fraserburgh",
      result: "L",
      score: "0-2"
    }
  },
  {
    position: 11,
    team: "Lossiemouth",
    played: 10,
    won: 3,
    drawn: 2,
    lost: 5,
    goalsFor: 10,
    goalsAgainst: 15,
    goalDifference: -5,
    points: 11,
    form: ["D", "L", "L", "D", "W"],
    lastResult: {
      opponent: "Keith",
      result: "W",
      score: "2-1"
    }
  },
  {
    position: 12,
    team: "Turriff United",
    played: 10,
    won: 2,
    drawn: 3,
    lost: 5,
    goalsFor: 9,
    goalsAgainst: 14,
    goalDifference: -5,
    points: 9,
    form: ["L", "D", "L", "D", "D"],
    lastResult: {
      opponent: "Deveronvale",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 13,
    team: "Deveronvale",
    played: 10,
    won: 2,
    drawn: 2,
    lost: 6,
    goalsFor: 8,
    goalsAgainst: 17,
    goalDifference: -9,
    points: 8,
    form: ["L", "W", "L", "L", "D"],
    lastResult: {
      opponent: "Turriff United",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 14,
    team: "Clachnacuddin",
    played: 10,
    won: 1,
    drawn: 3,
    lost: 6,
    goalsFor: 7,
    goalsAgainst: 19,
    goalDifference: -12,
    points: 6,
    form: ["L", "D", "L", "L", "D"],
    lastResult: {
      opponent: "Strathspey Thistle",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 15,
    team: "Forres Mechanics",
    played: 10,
    won: 1,
    drawn: 2,
    lost: 7,
    goalsFor: 6,
    goalsAgainst: 18,
    goalDifference: -12,
    points: 5,
    form: ["L", "L", "D", "L", "L"],
    lastResult: {
      opponent: "Brora Rangers",
      result: "L",
      score: "0-3"
    }
  },
  {
    position: 16,
    team: "Strathspey Thistle",
    played: 10,
    won: 0,
    drawn: 4,
    lost: 6,
    goalsFor: 5,
    goalsAgainst: 20,
    goalDifference: -15,
    points: 4,
    form: ["D", "L", "L", "L", "D"],
    lastResult: {
      opponent: "Clachnacuddin",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 17,
    team: "Brora Rangers",
    played: 10,
    won: 3,
    drawn: 3,
    lost: 4,
    goalsFor: 13,
    goalsAgainst: 12,
    goalDifference: 1,
    points: 12,
    form: ["W", "D", "L", "L", "W"],
    lastResult: {
      opponent: "Forres Mechanics",
      result: "W",
      score: "3-0"
    }
  }
];
