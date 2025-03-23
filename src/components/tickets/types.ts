
export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
}

export interface BasketItem {
  id: string;
  matchId: number;
  match: Match;
  ticketType: string;
  quantity: number;
  price: number;
}
