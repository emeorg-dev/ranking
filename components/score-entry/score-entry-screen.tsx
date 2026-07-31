'use client';

import { useMemo, useState } from 'react';

import { ConfirmationDialog } from '@/components/competition/confirmation-dialog';
import { CompetitionSettings } from '@/components/score-entry/competition-settings';
import { ScoreEntryToolbar } from '@/components/score-entry/score-entry-toolbar';
import { ScoreTable } from '@/components/score-entry/score-table';
import { sortRounds } from '@/lib/competition/rounds';
import type { CompetitionData, Round, Team } from '@/lib/types';

interface ScoreEntryScreenProps {
  data: CompetitionData;
  onSetScore: (teamId: string, roundId: string, score: number | null) => void;
  onAddTeam: (name: string) => void;
  onRemoveTeam: (teamId: string) => void;
  onAddRound: () => void;
  onRemoveRound: (roundId: string) => void;
  onUpdateCompetitionName: (name: string) => void;
  onToggleShowName: (checked: boolean) => void;
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
  onToggleShowName,
  onUpdateTeamName,
  onUpdateRoundName,
}: ScoreEntryScreenProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [roundToDelete, setRoundToDelete] = useState<Round | null>(null);

  const orderedRounds = useMemo(() => sortRounds(data.rounds), [data.rounds]);

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return data.teams;
    const query = searchQuery.toLowerCase();
    return data.teams.filter((team) => team.name.toLowerCase().includes(query));
  }, [data.teams, searchQuery]);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      onAddTeam(newTeamName.trim());
      setNewTeamName('');
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <CompetitionSettings
          name={data.name}
          showName={data.showName !== false}
          onUpdateName={onUpdateCompetitionName}
          onToggleShowName={onToggleShowName}
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Ingreso de puntajes · {data.teams.length} equipo
          {data.teams.length !== 1 ? 's' : ''} · {orderedRounds.length} ronda
          {orderedRounds.length !== 1 ? 's' : ''}
        </p>
      </header>

      <ScoreEntryToolbar
        searchQuery={searchQuery}
        newTeamName={newTeamName}
        onSearchChange={setSearchQuery}
        onNewTeamNameChange={setNewTeamName}
        onAddTeam={handleAddTeam}
        onAddRound={onAddRound}
      />

      <ScoreTable
        teams={data.teams}
        filteredTeams={filteredTeams}
        rounds={orderedRounds}
        scores={data.scores}
        onSetScore={onSetScore}
        onUpdateTeamName={onUpdateTeamName}
        onUpdateRoundName={onUpdateRoundName}
        onRequestDeleteTeam={setTeamToDelete}
        onRequestDeleteRound={setRoundToDelete}
      />

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
    </main>
  );
}
