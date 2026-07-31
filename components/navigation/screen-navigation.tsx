'use client';

import { RotateCcw } from 'lucide-react';

import { useLanguage } from '@/components/language/language-provider';
import { LanguageSelect } from '@/components/language/language-select';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AppScreen } from '@/lib/navigation/types';

interface ScreenNavigationProps {
  currentScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  onReset: () => void;
}

export function ScreenNavigation({
  currentScreen,
  onScreenChange,
  onReset,
}: ScreenNavigationProps) {
  const { t } = useLanguage();

  const TABS = [
    { id: 'entry' as const, label: t('ranking.navigation.scores') },
    { id: 'ranking' as const, label: t('ranking.navigation.ranking') },
  ];
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Segmented tabs */}
        <Tabs value={currentScreen} onValueChange={(value) => onScreenChange(value as AppScreen)}>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>[</Kbd>
              <span className="opacity-50">/</span>
              <Kbd>]</Kbd>
            </KbdGroup>
            <span>{t('common.actions.changeScreen')}</span>
            <span className="mx-1 opacity-30">·</span>
            <Kbd>R</Kbd>
            <span>{t('common.actions.showRanking')}</span>
          </p>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSelect />
            <ThemeToggle />
            
            <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('common.actions.reset')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
