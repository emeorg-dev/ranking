'use client';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

interface RankingHeaderProps {
  competitionName: string;
  showName: boolean;
  revealed: boolean;
  onToggleReveal: () => void;
}

export function RankingHeader({
  competitionName,
  showName,
  revealed,
  onToggleReveal,
}: RankingHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {showName !== false && (
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {competitionName}
          </h1>
        )}
        <h2 className="mt-0.5 text-base font-medium text-muted-foreground">Ranking</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {revealed ? 'Ranking visible' : 'Ranking oculto — mostrar cuando esté listo'}
        </p>
      </div>

      <Button
        variant={revealed ? 'outline' : 'default'}
        size="sm"
        onClick={onToggleReveal}
        className="gap-2"
      >
        {revealed ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
        {revealed ? 'Ocultar ranking' : 'Mostrar ranking'}
        <Kbd>R</Kbd>
      </Button>
    </header>
  );
}
