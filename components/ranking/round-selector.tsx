'use client';

import { Button } from '@/components/ui/button';
import type { Round } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RoundSelectorProps {
  rounds: Round[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function RoundSelector({ rounds, selectedIndex, onSelect }: RoundSelectorProps) {
  if (rounds.length <= 1) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs uppercase tracking-wide text-muted-foreground">Hasta</span>
      {rounds.map((round, index) => (
        <Button
          key={round.id}
          variant="ghost"
          size="sm"
          onClick={() => onSelect(index)}
          className={cn(
            'h-7 min-w-9 px-2 text-xs tabular-nums',
            selectedIndex === index &&
              'bg-foreground text-background hover:bg-foreground/90 hover:text-background'
          )}
        >
          {round.name}
        </Button>
      ))}
    </div>
  );
}
