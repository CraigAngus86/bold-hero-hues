
export interface TeamStats {
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
  id?: number; // Adding id property to interface since it's used in components
}

// Mock data for testing and fallbacks
export const mockLeagueData: TeamStats[] = [
  {
    position: 1,
    team: "Buckie Thistle",
    played: 20,
    won: 15,
    drawn: 3,
    lost: 2,
    goalsFor: 48,
    goalsAgainst: 15,
    goalDifference: 33,
    points: 48,
    form: ["W", "W", "W", "D", "L"],
    logo: "https://example.com/buckie_thistle.png"
  },
  {
    position: 2,
    team: "Brechin City",
    played: 20,
    won: 14,
    drawn: 2,
    lost: 4,
    goalsFor: 42,
    goalsAgainst: 18,
    goalDifference: 24,
    points: 44,
    form: ["W", "W", "L", "W", "D"],
    logo: "https://example.com/brechin_city.png"
  },
  {
    position: 3,
    team: "Banks o' Dee",
    played: 20,
    won: 13,
    drawn: 3,
    lost: 4,
    goalsFor: 44,
    goalsAgainst: 19,
    goalDifference: 25,
    points: 42,
    form: ["W", "W", "D", "W", "W"],
    logo: "/lovable-uploads/banks-o-dee-logo.png"
  },
  {
    position: 4,
    team: "Fraserburgh",
    played: 20,
    won: 12,
    drawn: 5,
    lost: 3,
    goalsFor: 39,
    goalsAgainst: 17,
    goalDifference: 22,
    points: 41,
    form: ["W", "D", "D", "W", "W"],
    logo: "https://example.com/fraserburgh.png"
  },
  {
    position: 5,
    team: "Brora Rangers",
    played: 20,
    won: 11,
    drawn: 4,
    lost: 5,
    goalsFor: 38,
    goalsAgainst: 21,
    goalDifference: 17,
    points: 37,
    form: ["L", "W", "W", "D", "W"],
    logo: "https://example.com/brora_rangers.png"
  }
];

// For complete league table
export const fullMockLeagueData: TeamStats[] = [
  ...mockLeagueData,
  {
    position: 6,
    team: "Formartine United",
    played: 20,
    won: 10,
    drawn: 3,
    lost: 7,
    goalsFor: 36,
    goalsAgainst: 27,
    goalDifference: 9,
    points: 33,
    form: ["W", "L", "W", "D", "L"],
    logo: "https://example.com/formartine.png"
  },
  {
    position: 7,
    team: "Huntly",
    played: 20,
    won: 9,
    drawn: 2,
    lost: 9,
    goalsFor: 29,
    goalsAgainst: 30,
    goalDifference: -1,
    points: 29,
    form: ["L", "L", "W", "W", "D"],
    logo: "https://example.com/huntly.png"
  },
  {
    position: 8,
    team: "Rothes",
    played: 20,
    won: 8,
    drawn: 4,
    lost: 8,
    goalsFor: 26,
    goalsAgainst: 24,
    goalDifference: 2,
    points: 28,
    form: ["D", "W", "L", "D", "W"],
    logo: "https://example.com/rothes.png"
  },
  {
    position: 9,
    team: "Keith",
    played: 20,
    won: 7,
    drawn: 3,
    lost: 10,
    goalsFor: 24,
    goalsAgainst: 34,
    goalDifference: -10,
    points: 24,
    form: ["L", "L", "W", "L", "W"],
    logo: "https://example.com/keith.png"
  },
  {
    position: 10,
    team: "Lossiemouth",
    played: 20,
    won: 6,
    drawn: 5,
    lost: 9,
    goalsFor: 22,
    goalsAgainst: 30,
    goalDifference: -8,
    points: 23,
    form: ["D", "L", "W", "D", "L"],
    logo: "https://example.com/lossiemouth.png"
  },
  {
    position: 11,
    team: "Clachnacuddin",
    played: 20,
    won: 6,
    drawn: 3,
    lost: 11,
    goalsFor: 20,
    goalsAgainst: 36,
    goalDifference: -16,
    points: 21,
    form: ["L", "L", "L", "W", "D"],
    logo: "https://example.com/clach.png"
  },
  {
    position: 12,
    team: "Turriff United",
    played: 20,
    won: 5,
    drawn: 4,
    lost: 11,
    goalsFor: 19,
    goalsAgainst: 35,
    goalDifference: -16,
    points: 19,
    form: ["D", "W", "D", "L", "L"],
    logo: "https://example.com/turriff.png"
  },
  {
    position: 13,
    team: "Nairn County",
    played: 20,
    won: 4,
    drawn: 5,
    lost: 11,
    goalsFor: 18,
    goalsAgainst: 35,
    goalDifference: -17,
    points: 17,
    form: ["L", "D", "L", "L", "W"],
    logo: "https://example.com/nairn.png"
  },
  {
    position: 14,
    team: "Deveronvale",
    played: 20,
    won: 4,
    drawn: 3,
    lost: 13,
    goalsFor: 18,
    goalsAgainst: 42,
    goalDifference: -24,
    points: 15,
    form: ["L", "L", "D", "L", "L"],
    logo: "https://example.com/deveronvale.png"
  },
  {
    position: 15,
    team: "Strathspey Thistle",
    played: 20,
    won: 3,
    drawn: 3,
    lost: 14,
    goalsFor: 14,
    goalsAgainst: 45,
    goalDifference: -31,
    points: 12,
    form: ["L", "L", "L", "D", "L"],
    logo: "https://example.com/strathspey.png"
  },
  {
    position: 16,
    team: "Wick Academy",
    played: 20,
    won: 3,
    drawn: 2,
    lost: 15,
    goalsFor: 15,
    goalsAgainst: 46,
    goalDifference: -31,
    points: 11,
    form: ["L", "L", "L", "W", "L"],
    logo: "https://example.com/wick.png"
  }
];
