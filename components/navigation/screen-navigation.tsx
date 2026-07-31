'use client';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScreenNavigationProps {
  currentScreen: 'entry' | 'ranking';
  onScreenChange: (screen: 'entry' | 'ranking') => void;
  onReset: () => void;
}

const TABS = [
  { id: 'entry' as const, label: 'Scores' },
  { id: 'ranking' as const, label: 'Rankings' },
];

export function ScreenNavigation({
  currentScreen,
  onScreenChange,
  onReset,
}: ScreenNavigationProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Segmented tabs */}
        <nav
          aria-label="Screens"
          className="flex items-center gap-1 rounded-lg bg-muted/60 p-1"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-current={currentScreen === tab.id ? 'page' : undefined}
              onClick={() => onScreenChange(tab.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                currentScreen === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-1 text-xs text-muted-foreground lg:flex">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-medium">
              Ctrl
            </kbd>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-medium">
              [
            </kbd>
            <span className="mx-0.5">/</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-medium">
              ]
            </kbd>
            <span className="ml-1">switch</span>
            <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 font-medium">
              R
            </kbd>
            <span className="ml-1">reveal</span>
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
