'use client';

import { useMemo, useState } from 'react';

import { ConfirmationDialog } from '@/components/competition/confirmation-dialog';
import { useLanguage } from '@/components/language/language-provider';
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
}: ScoreEntryScreenProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [roundToDelete, setRoundToDelete] = useState<Round | null>(null);
  
  const { t } = useLanguage();

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
          {t('ranking.scoreEntry.title')} · {data.teams.length} {data.teams.length !== 1 ? t('ranking.scoreEntry.teams') : t('ranking.scoreEntry.team')} · {orderedRounds.length} {orderedRounds.length !== 1 ? t('ranking.scoreEntry.rounds') : t('ranking.scoreEntry.round')}
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
        onRequestDeleteTeam={(team) => setTeamToDelete(team)}
        onRequestDeleteRound={setRoundToDelete}
      />

      {/* Diálogo de confirmación: eliminar equipo */}
      <ConfirmationDialog
        open={teamToDelete !== null}
        title={t('ranking.dialogs.deleteTeamTitle')}
        description={t('ranking.dialogs.deleteTeamDesc').replace('{0}', teamToDelete?.name ?? '')}
        confirmLabel={t('ranking.dialogs.deleteTeamConfirm')}
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
        title={t('ranking.dialogs.deleteRoundTitle')}
        description={t('ranking.dialogs.deleteRoundDesc').replace('{0}', roundToDelete?.name ?? '')}
        confirmLabel={t('ranking.dialogs.deleteRoundConfirm')}
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
