export interface Team {
  id: string;
  name: string;
}

export interface Round {
  id: string;
  name: string;
  order: number;
}

export interface Score {
  teamId: string;
  roundId: string;
  value: number | null;
}

export interface CompetitionData {
  name: string;
  teams: Team[];
  rounds: Round[];
  scores: Score[];
}

export interface RankedTeam extends Team {
  scores: Record<string, number | null>; // Maps roundId to score
  total: number;
  rank: number;
}
