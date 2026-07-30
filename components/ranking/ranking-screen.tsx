'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { CompetitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { calculateRanking, assignRanks } from '@/lib/competition/ranking';

interface RankingScreenProps {
  data: CompetitionData;
  active?: boolean;
}

const PODIUM = [
  { ring: 'ring-1 ring-primary/30', label: '1st' },
  { ring: 'ring-1 ring-border', label: '2nd' },
  { ring: 'ring-1 ring-border', label: '3rd' },
];

export function RankingScreen({
  data,
  active = true,
}: RankingScreenProps) {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(
    Math.max(0, data.rounds.length - 1)
  );
  const [revealed, setRevealed] = useState(false);

  // Sync selectedRoundIndex if rounds are removed
  useEffect(() => {
    setSelectedRoundIndex((prev) =>
      data.rounds.length === 0 ? 0 : Math.min(prev, data.rounds.length - 1)
    );
  }, [data.rounds.length]);

  // Toggle reveal with the R key while the ranking screen is visible
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setRevealed((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  const activeRounds = data.rounds.slice(0, selectedRoundIndex + 1);
  const activeRoundIds = new Set(activeRounds.map((r) => r.id));
  const rankedTeams = assignRanks(calculateRanking(data, activeRoundIds));

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Rankings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {revealed ? 'Scores revealed' : 'Scores hidden — reveal when ready'}
          </p>
        </div>

        <Button
          variant={revealed ? 'outline' : 'default'}
          size="sm"
          onClick={() => setRevealed((prev) => !prev)}
          className="gap-2"
        >
          {revealed ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
          {revealed ? 'Hide scores' : 'Reveal scores'}
          <kbd className="ml-1 hidden rounded border border-current/20 px-1.5 py-0.5 text-[10px] font-medium opacity-70 sm:inline">
            R
          </kbd>
        </Button>
      </header>

      {/* Round selector */}
      {data.rounds.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs uppercase tracking-wide text-muted-foreground">
            Through round
          </span>
          {data.rounds.map((round, index) => (
            <Button
              key={round.id}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRoundIndex(index)}
              className={cn(
                'h-7 min-w-9 px-2 text-xs tabular-nums',
                selectedRoundIndex === index &&
                  'bg-foreground text-background hover:bg-foreground/90 hover:text-background'
              )}
            >
              {round.name}
            </Button>
          ))}
        </div>
      )}

      {/* Rankings */}
      <ol className="flex flex-col gap-2.5">
        {rankedTeams.map((team, index) => {
          const roundScores = activeRounds.map(r => team.scores[r.id]);
          // Use explicit rank for podium
          const podiumIndex = team.rank - 1;
          const podium = podiumIndex >= 0 && podiumIndex < 3 ? PODIUM[podiumIndex] : null;
          
          // Reveal from last place up to first for a countdown feel
          const revealDelay = (rankedTeams.length - 1 - index) * 110;

          return (
            <li
              key={team.id}
              className={cn(
                'animate-fade-in-up relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5',
                podium?.ring
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Hidden-state hint */}
              <div
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-opacity duration-500',
                  revealed ? 'opacity-0' : 'opacity-100'
                )}
                style={{ transitionDelay: `${revealed ? revealDelay : 0}ms` }}
              >
                <Lock className="size-3.5" />
                Hidden
              </div>

              <div
                className={cn(
                  'flex items-center gap-4 transition-all duration-700 ease-out',
                  revealed
                    ? 'blur-0 opacity-100'
                    : 'select-none blur-md opacity-40'
                )}
                style={{ transitionDelay: `${revealed ? revealDelay : 0}ms` }}
              >
                {/* Position */}
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums',
                    team.rank === 1
                      ? 'border-primary/40 text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {team.rank}
                </span>

                {/* Team */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="truncate font-medium">{team.name}</p>
                    {podium && (
                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {podium.label}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {activeRounds.map((r, i) => (
                      <span key={r.id} className="tabular-nums">
                        {r.name}
                        <span className="ml-1 font-medium text-foreground/80">
                          {team.scores[r.id] ?? '-'}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-semibold tabular-nums sm:text-3xl">
                    {team.total}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {activeRounds.length} round
                    {activeRounds.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {rankedTeams.length === 0 && (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No teams yet. Add teams in Score Entry.
        </p>
      )}
    </div>
  );
}
