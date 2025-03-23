
import { Match, TeamStats } from './types';

export const mockMatches: Match[] = [
  {
    id: 1,
    homeTeam: "Banks o' Dee",
    awayTeam: "Formartine United",
    homeScore: 3,
    awayScore: 1,
    date: "2023-09-23",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 2,
    homeTeam: "Huntly",
    awayTeam: "Banks o' Dee",
    homeScore: 0,
    awayScore: 2,
    date: "2023-09-16",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Christie Park"
  },
  {
    id: 3,
    homeTeam: "Banks o' Dee",
    awayTeam: "Deveronvale",
    homeScore: 4,
    awayScore: 0,
    date: "2023-09-09",
    time: "15:00",
    competition: "Highland League Cup",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 4,
    homeTeam: "Banks o' Dee",
    awayTeam: "Buckie Thistle",
    date: "2023-09-30",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Spain Park"
  },
  {
    id: 5,
    homeTeam: "Fraserburgh",
    awayTeam: "Banks o' Dee",
    date: "2023-10-07",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Bellslea Park"
  },
  {
    id: 6,
    homeTeam: "Banks o' Dee",
    awayTeam: "Lossiemouth",
    date: "2023-10-14",
    time: "15:00",
    competition: "Highland League Cup",
    isCompleted: false,
    venue: "Spain Park"
  }
];

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
