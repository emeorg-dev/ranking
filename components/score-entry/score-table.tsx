'use client';

import { useRef } from 'react';
import { X } from 'lucide-react';

import { useLanguage } from '@/components/language/language-provider';
import { ScoreTeamRow } from '@/components/score-entry/score-team-row';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useScoreTableScroll } from '@/hooks/use-score-table-scroll';
import { createScoreMap } from '@/lib/competition/scores';
import type { Round, Score, Team } from '@/lib/types';

interface ScoreTableProps {
  teams: Team[];
  filteredTeams: Team[];
  rounds: Round[];
  scores: Score[];
  onSetScore: (teamId: string, roundId: string, value: number | null) => void;
  onUpdateTeamName: (teamId: string, name: string) => void;
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
  onRequestDeleteTeam,
  onRequestDeleteRound,
}: ScoreTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scoreMap = createScoreMap(scores);
  const { t } = useLanguage();

  useScoreTableScroll(scrollContainerRef, rounds.length);

  return (
    <div ref={scrollContainerRef} className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 min-w-36 bg-muted/40 px-4 text-left">
              {t('ranking.table.team')}
            </TableHead>
            {rounds.map((round, index) => (
              <TableHead key={round.id} className="group relative min-w-28 px-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span
                    className="h-6 min-w-0 border-transparent bg-transparent px-1 text-center text-xs font-medium uppercase tracking-wide flex items-center justify-center"
                    aria-label={t('ranking.table.roundName').replace('{0}', (index + 1).toString())}
                  >
                    {t('ranking.table.roundName').replace('{0}', (index + 1).toString())}
                  </span>
                  <button
                    onClick={() => onRequestDeleteRound(round)}
                    className="shrink-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                    title={t('ranking.table.deleteRound')}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </TableHead>
            ))}
            <TableHead className="min-w-20 px-3 text-center">{t('ranking.table.total')}</TableHead>
            <TableHead className="w-12 px-2">
              <span className="sr-only">{t('ranking.table.deleteTeam')}</span>
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
          {t('ranking.table.noTeamsYet')}
        </p>
      ) : filteredTeams.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          {t('ranking.table.noTeamsMatch')}
        </p>
      ) : null}
    </div>
  );
}
