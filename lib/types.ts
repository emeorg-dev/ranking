export interface Team {
  id: string;
  name: string;
}

export interface Score {
  teamId: string;
  round: number;
  score: number;
}

export interface CompetitionData {
  teams: Team[];
  scores: Score[];
}

export interface TeamWithScores extends Team {
  scores: number[];
  total: number;
}
