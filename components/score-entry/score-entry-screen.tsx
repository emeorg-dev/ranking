'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { CompetitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScoreEntryScreenProps {
  data: CompetitionData;
  onSetScore: (teamId: string, roundId: string, score: number | null) => void;
  onAddTeam: (name: string) => void;
  onRemoveTeam: (teamId: string) => void;
  onAddRound: () => void;
  onRemoveRound: (roundId: string) => void;
}

export function ScoreEntryScreen({
  data,
  onSetScore,
  onAddTeam,
  onRemoveTeam,
  onAddRound,
  onRemoveRound,
}: ScoreEntryScreenProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const roundsCount = data.rounds.length;

  // Keep the newest rounds in view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || roundsCount <= 5) return;

    const id = window.setTimeout(() => {
      container.scrollTo({
        left: container.scrollWidth - container.clientWidth,
        behavior: 'smooth',
      });
    }, 80);

    return () => window.clearTimeout(id);
  }, [roundsCount]);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      onAddTeam(newTeamName.trim());
      setNewTeamName('');
    }
  };

  const handleScoreChange = (teamId: string, roundId: string, value: string) => {
    const score =
      value === '' ? null : Math.max(0, Math.min(100, parseInt(value) || 0));
    onSetScore(teamId, roundId, score);
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Score Entry
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.teams.length} team{data.teams.length !== 1 ? 's' : ''} ·{' '}
          {roundsCount} round{roundsCount !== 1 ? 's' : ''} recorded
        </p>
      </header>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Add a team…"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleAddTeam();
              }
            }}
            className="h-9 flex-1"
          />
          <Button onClick={handleAddTeam} size="sm" className="h-9 gap-1.5">
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add team</span>
          </Button>
        </div>
        
        <Button onClick={onAddRound} size="sm" variant="outline" className="h-9 gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          <span>Add Round</span>
        </Button>
      </div>

      {/* Scores table */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto rounded-xl border"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-36 bg-muted/40 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground backdrop-blur"
              >
                Team
              </th>
              {data.rounds.map((round) => (
                <th
                  key={round.id}
                  scope="col"
                  className="min-w-24 px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground tabular-nums group relative"
                >
                  {round.name}
                  <button 
                    onClick={() => onRemoveRound(round.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-destructive"
                    title="Remove round"
                  >
                    <X className="size-3" />
                  </button>
                </th>
              ))}
              <th
                scope="col"
                className="min-w-20 px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Total
              </th>
              <th scope="col" className="w-12 px-2 py-2.5">
                <span className="sr-only">Remove team</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.teams.map((team) => {
              let total = 0;

              return (
                <tr
                  key={team.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 min-w-36 truncate bg-card px-4 py-2 text-left font-medium"
                  >
                    {team.name}
                  </th>
                  {data.rounds.map((round) => {
                    const score =
                      data.scores.find(
                        (s) => s.teamId === team.id && s.roundId === round.id
                      )?.value;
                    total += score ?? 0;

                    return (
                      <td key={round.id} className="min-w-24 px-2 py-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          inputMode="numeric"
                          aria-label={`${team.name} ${round.name} score`}
                          value={score ?? ''}
                          onChange={(e) =>
                            handleScoreChange(team.id, round.id, e.target.value)
                          }
                          className="h-8 border-transparent bg-transparent text-center tabular-nums shadow-none hover:border-input focus-visible:border-input"
                        />
                      </td>
                    );
                  })}
                  <td className="min-w-20 px-3 py-2 text-center font-semibold tabular-nums">
                    {total}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveTeam(team.id)}
                    >
                      <X className="size-4" aria-hidden="true" />
                      <span className="sr-only">Remove {team.name}</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {data.teams.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Add your first team to start scoring.
          </p>
        )}
      </div>
    </div>
  );
}
