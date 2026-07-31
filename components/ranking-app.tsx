'use client';

import { useCallback,useState } from 'react';

import { ScreenNavigation } from '@/components/navigation/screen-navigation';
import { RankingScreen } from '@/components/ranking/ranking-screen';
import { ScoreEntryScreen } from '@/components/score-entry/score-entry-screen';
import { useCompetition } from '@/hooks/use-competition';
import { useCompetitionStorage } from '@/hooks/use-local-storage';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { getEmptyData } from '@/lib/competition/default-data';

export function RankingApp() {
  const [currentScreen, setCurrentScreen] = useState<'entry' | 'ranking'>('entry');
  const [savedData, setSavedData, isHydrated] = useCompetitionStorage(getEmptyData());
  const competition = useCompetition(savedData, setSavedData);

  // Handle keyboard shortcuts
  useShortcuts({
    onGoToEntry: () => setCurrentScreen('entry'),
    onGoToRanking: () => setCurrentScreen('ranking'),
  });

  const handleReset = useCallback(() => {
    competition.reset();
  }, [competition]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ScreenNavigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onReset={handleReset}
      />

      <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
        {/* Sliding container */}
        <div
          className="flex items-start transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(${currentScreen === 'entry' ? '0' : '-100%'})`,
          }}
        >
          {/* Pantalla de ingreso de puntajes */}
          <div className="w-full flex-shrink-0" aria-hidden={currentScreen !== 'entry'}>
            <ScoreEntryScreen
              data={competition.data}
              onSetScore={competition.setScore}
              onAddTeam={competition.addTeam}
              onRemoveTeam={competition.removeTeam}
              onAddRound={() =>
                competition.addRound(`Ronda ${competition.data.rounds.length + 1}`)
              }
              onRemoveRound={competition.removeRound}
              onUpdateCompetitionName={competition.updateCompetitionName}
              onUpdateTeamName={competition.updateTeamName}
              onUpdateRoundName={competition.updateRoundName}
            />
          </div>

          {/* Pantalla de ranking */}
          <div
            className="w-full flex-shrink-0"
            aria-hidden={currentScreen !== 'ranking'}
          >
            <RankingScreen data={competition.data} active={currentScreen === 'ranking'} />
          </div>
        </div>
      </div>
    </div>
  );
}
