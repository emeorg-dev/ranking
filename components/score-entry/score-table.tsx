'use client';

import { useRef } from 'react';
import { X } from 'lucide-react';

import { ScoreTeamRow } from '@/components/score-entry/score-team-row';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createScoreMap } from '@/lib/competition/scores';
import { useScoreTableScroll } from '@/hooks/use-score-table-scroll';
import type { Round, Score, Team } from '@/lib/types';

interface ScoreTableProps {
  teams: Team[];
  filteredTeams: Team[];
  rounds: Round[];
  scores: Score[];
  onSetScore: (teamId: string, roundId: string, value: number | null) => void;
  onUpdateTeamName: (teamId: string, name: string) => void;
  onUpdateRoundName: (roundId: string, name: string) => void;
  onRequestDeleteTeam: (team: Team) => void;
  onRequestDeleteRound: (round: Round) => void;
}

export function ScoreTable({
  teams,
  filteredTeams,
  rounds,
  scores,
  onSetScore,
  onUpdateTeamName,
  onUpdateRoundName,
  onRequestDeleteTeam,
  onRequestDeleteRound,
}: ScoreTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scoreMap = createScoreMap(scores);

  useScoreTableScroll(scrollContainerRef, rounds.length);

  const handleRoundNameBlur = (roundId: string, currentName: string) => {
    const trimmed = currentName.trim();
    onUpdateRoundName(roundId, trimmed || 'Ronda sin nombre');
  };

  return (
    <div ref={scrollContainerRef} className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 min-w-36 bg-muted/40 px-4 text-left">
              Equipo
            </TableHead>
            {rounds.map((round) => (
              <TableHead key={round.id} className="group relative min-w-28 px-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Input
                    value={round.name}
                    onChange={(e) => onUpdateRoundName(round.id, e.target.value)}
                    onBlur={(e) => handleRoundNameBlur(round.id, e.target.value)}
                    className="h-6 w-20 min-w-0 border-transparent bg-transparent px-1 text-center text-xs font-medium uppercase tracking-wide shadow-none hover:border-input focus-visible:border-input"
                    aria-label={`Nombre de ${round.name}`}
                  />
                  <button
                    onClick={() => onRequestDeleteRound(round)}
                    className="shrink-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                    title="Eliminar ronda"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </TableHead>
            ))}
            <TableHead className="min-w-20 px-3 text-center">Total</TableHead>
            <TableHead className="w-12 px-2">
              <span className="sr-only">Eliminar equipo</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeams.map((team) => (
            <ScoreTeamRow
              key={team.id}
              team={team}
              rounds={rounds}
              scoreMap={scoreMap}
              onSetScore={onSetScore}
              onUpdateTeamName={onUpdateTeamName}
              onRequestDelete={onRequestDeleteTeam}
            />
          ))}
        </TableBody>
      </Table>

      {teams.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          Todavía no hay equipos. Agrega el primer equipo para comenzar.
        </p>
      ) : filteredTeams.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          No se encontraron equipos que coincidan con la búsqueda.
        </p>
      ) : null}
    </div>
  );
}
