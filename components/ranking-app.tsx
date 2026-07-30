'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCompetition, getInitialData } from '@/hooks/use-competition';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { CompetitionData } from '@/lib/types';
import { ScoreEntryScreen } from '@/components/score-entry/score-entry-screen';
import { RankingScreen } from '@/components/ranking/ranking-screen';
import { ScreenNavigation } from '@/components/navigation/screen-navigation';

export function RankingApp() {
  const [currentScreen, setCurrentScreen] = useState<'entry' | 'ranking'>('entry');
  const [savedData, setSavedData, isHydrated] = useLocalStorage<CompetitionData>(
    'competition-data',
    getInitialData()
  );
  const competition = useCompetition(savedData);

  // Sync competition data to localStorage
  useEffect(() => {
    if (isHydrated) {
      setSavedData(competition.data);
    }
  }, [competition.data, setSavedData, isHydrated]);

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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const maxRound = competition.getMaxRound();
  const teamsWithScores = competition.getTeamsWithScores(maxRound);

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
          {/* Score Entry Screen */}
          <div
            className="w-full flex-shrink-0"
            aria-hidden={currentScreen !== 'entry'}
          >
            <ScoreEntryScreen
              data={competition.data}
              onSetScore={competition.setScore}
              onAddTeam={competition.addTeam}
              onRemoveTeam={competition.removeTeam}
              maxRound={maxRound}
            />
          </div>

          {/* Ranking Screen */}
          <div
            className="w-full flex-shrink-0"
            aria-hidden={currentScreen !== 'ranking'}
          >
            <RankingScreen
              teamsWithScores={teamsWithScores}
              maxRound={maxRound}
              active={currentScreen === 'ranking'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
