'use client';

import { useEffect, useMemo,useRef, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';

import { ConfirmationDialog } from '@/components/competition/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sortRounds } from '@/lib/competition/rounds';
import { createScoreMap, getScoreValue } from '@/lib/competition/scores';
import type { CompetitionData, Round,Team } from '@/lib/types';

interface ScoreEntryScreenProps {
  data: CompetitionData;
  onSetScore: (teamId: string, roundId: string, score: number | null) => void;
  onAddTeam: (name: string) => void;
  onRemoveTeam: (teamId: string) => void;
  onAddRound: () => void;
  onRemoveRound: (roundId: string) => void;
  onUpdateCompetitionName: (name: string) => void;
  onUpdateTeamName: (teamId: string, name: string) => void;
  onUpdateRoundName: (roundId: string, name: string) => void;
}

export function ScoreEntryScreen({
  data,
  onSetScore,
  onAddTeam,
  onRemoveTeam,
  onAddRound,
  onRemoveRound,
  onUpdateCompetitionName,
  onUpdateTeamName,
  onUpdateRoundName,
}: ScoreEntryScreenProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [roundToDelete, setRoundToDelete] = useState<Round | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const orderedRounds = useMemo(() => sortRounds(data.rounds), [data.rounds]);
  const scoreMap = useMemo(() => createScoreMap(data.scores), [data.scores]);
  const roundsCount = orderedRounds.length;

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return data.teams;
    const query = searchQuery.toLowerCase();
    return data.teams.filter((team) => team.name.toLowerCase().includes(query));
  }, [data.teams, searchQuery]);

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
    if (value === '') {
      onSetScore(teamId, roundId, null);
      return;
    }

    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
      return;
    }

    onSetScore(teamId, roundId, Math.max(0, parsedValue));
  };

  const handleTeamNameBlur = (teamId: string, currentName: string) => {
    const trimmed = currentName.trim();
    onUpdateTeamName(teamId, trimmed || 'Equipo sin nombre');
  };

  const handleRoundNameBlur = (roundId: string, currentName: string) => {
    const trimmed = currentName.trim();
    onUpdateRoundName(roundId, trimmed || 'Ronda sin nombre');
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <Input
          value={data.name}
          onChange={(e) => onUpdateCompetitionName(e.target.value)}
          className="mb-1 h-auto border-transparent bg-transparent px-0 text-2xl font-semibold tracking-tight shadow-none hover:border-input focus-visible:border-input sm:text-3xl"
          aria-label="Nombre de la competencia"
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Ingreso de puntajes · {data.teams.length} equipo{data.teams.length !== 1 ? 's' : ''} ·{' '}
          {roundsCount} ronda{roundsCount !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Acciones */}
      <div className="mb-6 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2 flex-1 min-w-[200px] max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Buscar equipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-1 min-w-[200px] justify-end">
          <Input
            placeholder="Agregar equipo…"
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
          <Button onClick={handleAddTeam} size="sm" className="h-9 gap-1.5 shrink-0">
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Agregar equipo</span>
          </Button>
        </div>

        <Button onClick={onAddRound} size="sm" variant="outline" className="h-9 gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          <span>Agregar ronda</span>
        </Button>
      </div>

      {/* Tabla de puntajes */}
      <div ref={scrollContainerRef} className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-36 bg-muted/40 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground backdrop-blur"
              >
                Equipo
              </th>
              {orderedRounds.map((round) => (
                <th
                  key={round.id}
                  scope="col"
                  className="min-w-28 px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground tabular-nums group relative"
                >
                  <div className="flex items-center justify-center gap-1">
                    <Input
                      value={round.name}
                      onChange={(e) => onUpdateRoundName(round.id, e.target.value)}
                      onBlur={(e) => handleRoundNameBlur(round.id, e.target.value)}
                      className="h-6 min-w-0 w-20 border-transparent bg-transparent px-1 text-center text-xs font-medium uppercase tracking-wide shadow-none hover:border-input focus-visible:border-input"
                      aria-label={`Nombre de ${round.name}`}
                    />
                    <button
                      onClick={() => setRoundToDelete(round)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                      title="Eliminar ronda"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="min-w-20 px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Total
              </th>
              <th scope="col" className="w-12 px-2 py-2.5">
                <span className="sr-only">Eliminar equipo</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team) => {
              let total = 0;

              return (
                <tr key={team.id} className="border-b last:border-0 hover:bg-muted/30">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 min-w-36 bg-card px-3 py-2 text-left font-medium"
                  >
                    <Input
                      value={team.name}
                      onChange={(e) => onUpdateTeamName(team.id, e.target.value)}
                      onBlur={(e) => handleTeamNameBlur(team.id, e.target.value)}
                      className="h-7 border-transparent bg-transparent px-1 font-medium shadow-none hover:border-input focus-visible:border-input truncate"
                      aria-label={`Nombre del equipo ${team.name}`}
                    />
                  </th>
                  {orderedRounds.map((round) => {
                    const score = getScoreValue(scoreMap, team.id, round.id);
                    total += score ?? 0;

                    return (
                      <td key={round.id} className="min-w-24 px-2 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          aria-label={`${team.name} ${round.name} puntaje`}
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
                      onClick={() => setTeamToDelete(team)}
                    >
                      <X className="size-4" aria-hidden="true" />
                      <span className="sr-only">Eliminar {team.name}</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {data.teams.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Todavía no hay equipos. Agrega el primer equipo para comenzar.
          </p>
        ) : filteredTeams.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No se encontraron equipos que coincidan con la búsqueda.
          </p>
        ) : null}
      </div>

      {/* Diálogo de confirmación: eliminar equipo */}
      <ConfirmationDialog
        open={teamToDelete !== null}
        title="¿Eliminar equipo?"
        description={`Se eliminará "${teamToDelete?.name}" y todos sus puntajes. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar equipo"
        onConfirm={() => {
          if (teamToDelete) {
            onRemoveTeam(teamToDelete.id);
            setTeamToDelete(null);
          }
        }}
        onOpenChange={(open) => {
          if (!open) setTeamToDelete(null);
        }}
      />

      {/* Diálogo de confirmación: eliminar ronda */}
      <ConfirmationDialog
        open={roundToDelete !== null}
        title="¿Eliminar ronda?"
        description={`Se eliminará "${roundToDelete?.name}" y todos los puntajes asociados a esta ronda. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar ronda"
        onConfirm={() => {
          if (roundToDelete) {
            onRemoveRound(roundToDelete.id);
            setRoundToDelete(null);
          }
        }}
        onOpenChange={(open) => {
          if (!open) setRoundToDelete(null);
        }}
      />
    </div>
  );
}
