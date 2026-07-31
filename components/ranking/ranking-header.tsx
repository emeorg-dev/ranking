'use client';

import { Eye, EyeOff, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import type { RevealMode } from '@/hooks/ranking-reveal/reveal-reducer';

interface RankingHeaderProps {
  competitionName: string;
  showName: boolean;
  revealMode: RevealMode;
  onStartReveal: () => void;
  onShowInstantly: () => void;
  onHide: () => void;
}

export function RankingHeader({
  competitionName,
  showName,
  revealMode,
  onStartReveal,
  onShowInstantly,
  onHide,
}: RankingHeaderProps) {
  let statusText: string;

  if (revealMode === 'sequential') {
    statusText = 'Revelando ranking…';
  } else if (revealMode === 'instant') {
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

      <div className="flex flex-wrap items-center gap-2">
        {revealMode === 'hidden' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowInstantly}
              className="gap-2"
            >
              <Zap className="size-4" aria-hidden="true" />
              Vista rápida
              <Kbd>Z</Kbd>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onStartReveal}
              className="gap-2"
            >
              <Eye className="size-4" aria-hidden="true" />
              Mostrar ranking
              <Kbd>R</Kbd>
            </Button>
          </>
        )}

        {revealMode === 'sequential' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowInstantly}
              className="gap-2"
            >
              <Zap className="size-4" aria-hidden="true" />
              Mostrar todo
              <Kbd>Z</Kbd>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onHide}
              className="gap-2"
            >
              <EyeOff className="size-4" aria-hidden="true" />
              Ocultar ranking
              <Kbd>R</Kbd>
            </Button>
          </>
        )}

        {revealMode === 'instant' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onHide}
            className="gap-2"
          >
            <EyeOff className="size-4" aria-hidden="true" />
            Ocultar ranking
            <span className="flex items-center gap-1">
              <Kbd>Z</Kbd>
              <span className="opacity-50">/</span>
              <Kbd>R</Kbd>
            </span>
          </Button>
        )}
      </div>
    </header>
  );
}
