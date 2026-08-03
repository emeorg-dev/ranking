'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { getScoreValue } from '@/lib/competition/scores';
import type { Round, Team } from '@/lib/types';

interface ScoreTeamRowProps {
  team: Team;
  rounds: Round[];
  scoreMap: Map<string, number | null>;
  onSetScore: (teamId: string, roundId: string, value: number | null) => void;
  onUpdateTeamName: (teamId: string, name: string) => void;
  onRequestDelete: (team: Team) => void;
  index: number;
}

export function ScoreTeamRow({
  team,
  rounds,
  scoreMap,
  onSetScore,
  onUpdateTeamName,
  onRequestDelete,
  index,
}: ScoreTeamRowProps) {
  let total = 0;
  
  const isEven = index % 2 === 0;

  const handleScoreChange = (roundId: string, value: string) => {
    if (value === '') {
      onSetScore(team.id, roundId, null);
      return;
    }

    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue)) return;

    onSetScore(team.id, roundId, Math.max(0, parsedValue));
  };

  const handleNameBlur = (currentName: string) => {
    const trimmed = currentName.trim();
    onUpdateTeamName(team.id, trimmed || 'Equipo sin nombre');
  };

  return (
    <TableRow className={`border-b-0 hover:bg-muted/30 ${isEven ? 'bg-muted/20' : 'bg-transparent'}`}>
      <TableCell className={`sticky left-0 z-10 min-w-36 px-3 py-2 text-left font-medium ${isEven ? 'bg-card brightness-95 dark:brightness-110' : 'bg-card'}`}>
        <Input
          value={team.name}
          onChange={(e) => onUpdateTeamName(team.id, e.target.value)}
          onBlur={(e) => handleNameBlur(e.target.value)}
          className="h-7 border-none bg-transparent px-1 font-medium shadow-none focus-visible:ring-0 dark:bg-transparent hover:bg-accent focus-visible:bg-accent"
          aria-label={`Nombre del equipo ${team.name}`}
        />
      </TableCell>

      {rounds.map((round) => {
        const score = getScoreValue(scoreMap, team.id, round.id);
        total += score ?? 0;

        return (
          <TableCell key={round.id} className="min-w-24 px-2 py-2">
            <Input
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              aria-label={`${team.name} ${round.name} puntaje`}
              value={score ?? ''}
              onChange={(e) => handleScoreChange(round.id, e.target.value)}
              className="h-8 text-center tabular-nums"
            />
          </TableCell>
        );
      })}

      <TableCell className="min-w-20 px-3 py-2 text-center font-semibold tabular-nums">
        {total}
      </TableCell>

      <TableCell className="px-2 py-2 text-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRequestDelete(team)}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Eliminar {team.name}</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
