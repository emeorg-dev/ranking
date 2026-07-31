'use client';

import { useCallback, useState } from 'react';

import { ScreenNavigation } from '@/components/navigation/screen-navigation';
import { RankingScreen } from '@/components/ranking/ranking-screen';
import { ScoreEntryScreen } from '@/components/score-entry/score-entry-screen';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCompetition } from '@/hooks/use-competition';
import { useCompetitionStorage } from '@/hooks/use-local-storage';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { getEmptyData } from '@/lib/competition/default-data';
import type { AppScreen } from '@/lib/navigation/types';

export function RankingApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('entry');
  const [savedData, setSavedData, isHydrated] = useCompetitionStorage(getEmptyData());
  const competition = useCompetition(savedData, setSavedData);

  useShortcuts({
    onGoToEntry: () => setCurrentScreen('entry'),
    onGoToRanking: () => setCurrentScreen('ranking'),
  });

  const handleReset = useCallback(() => {
    competition.reset();
  }, [competition]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <ScreenNavigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onReset={handleReset}
      />

      {/* Contenedor con scroll independiente por pantalla */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="flex h-full will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            transform: currentScreen === 'entry' ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          {/* Pantalla de ingreso de puntajes */}
          <section
            className="h-full w-full shrink-0"
            aria-hidden={currentScreen !== 'entry'}
            {...(currentScreen !== 'entry' ? { inert: true } : {})}
          >
            <ScrollArea className="h-full">
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
                onToggleShowName={competition.toggleShowName}
                onUpdateTeamName={competition.updateTeamName}
                onUpdateRoundName={competition.updateRoundName}
              />
            </ScrollArea>
          </section>

          {/* Pantalla de ranking — el scroll lo gestiona RankingScreen internamente */}
          <section
            className="h-full w-full shrink-0 overflow-hidden"
            aria-hidden={currentScreen !== 'ranking'}
            {...(currentScreen !== 'ranking' ? { inert: true } : {})}
          >
            <RankingScreen data={competition.data} active={currentScreen === 'ranking'} />
          </section>
        </div>
      </div>
    </div>
  );
}
