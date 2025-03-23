
import { Match } from './types';

// Mock data for demonstration - this would be fetched from an API
export const mockMatches: Match[] = [
  // August
  {
    id: 101,
    homeTeam: "Banks o' Dee",
    awayTeam: "Brora Rangers",
    homeScore: 2,
    awayScore: 2,
    date: "2023-08-05",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 102,
    homeTeam: "Rothes",
    awayTeam: "Banks o' Dee",
    homeScore: 0,
    awayScore: 3,
    date: "2023-08-12",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Mackessack Park"
  },
  {
    id: 103,
    homeTeam: "Banks o' Dee",
    awayTeam: "Keith",
    homeScore: 4,
    awayScore: 1,
    date: "2023-08-19",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 104,
    homeTeam: "Turriff United",
    awayTeam: "Banks o' Dee",
    homeScore: 1,
    awayScore: 2,
    date: "2023-08-26",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "The Haughs"
  },
  // September
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
  // October
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
  },
  {
    id: 7,
    homeTeam: "Nairn County",
    awayTeam: "Banks o' Dee",
    date: "2023-10-21",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Station Park"
  },
  {
    id: 8,
    homeTeam: "Banks o' Dee",
    awayTeam: "Wick Academy",
    date: "2023-10-28",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Spain Park"
  },
  // November
  {
    id: 9,
    homeTeam: "Clachnacuddin",
    awayTeam: "Banks o' Dee",
    date: "2023-11-04",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Grant Street Park"
  },
  {
    id: 10,
    homeTeam: "Banks o' Dee",
    awayTeam: "Strathspey Thistle",
    date: "2023-11-11",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Spain Park"
  }
];

export const competitions = ["All Competitions", "Highland League", "Highland League Cup", "Aberdeenshire Cup", "Aberdeenshire Shield", "Scottish Cup"];
