'use client';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

interface RankingHeaderProps {
  competitionName: string;
  showName: boolean;
  /** true cuando el ranking está parcial o totalmente revelado (o en curso). */
  isRevealing: boolean;
  /** true solo mientras la secuencia de revelación avanza automáticamente. */
  isPlaying: boolean;
  onToggleReveal: () => void;
}

export function RankingHeader({
  competitionName,
  showName,
  isRevealing,
  isPlaying,
  onToggleReveal,
}: RankingHeaderProps) {
  let statusText: string;

  if (isPlaying) {
    statusText = 'Revelando ranking…';
  } else if (isRevealing) {
    statusText = 'Ranking visible';
  } else {
    statusText = 'Ranking oculto — mostrar cuando esté listo';
  }

  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {showName && (
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {competitionName}
          </h1>
        )}
        <h2 className="mt-0.5 text-base font-medium text-muted-foreground">Ranking</h2>
        <p className="mt-1 text-sm text-muted-foreground">{statusText}</p>
      </div>

      <Button
        variant={isRevealing ? 'outline' : 'default'}
        size="sm"
        onClick={onToggleReveal}
        className="gap-2"
      >
        {isRevealing ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
        {isRevealing ? 'Ocultar ranking' : 'Mostrar ranking'}
        <Kbd>R</Kbd>
      </Button>
    </header>
  );
}
