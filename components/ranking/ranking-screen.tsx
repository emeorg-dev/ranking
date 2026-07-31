'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { assignRanks, calculateRanking } from '@/lib/competition/ranking';
import { sortRounds } from '@/lib/competition/rounds';
import type { CompetitionData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RankingScreenProps {
  data: CompetitionData;
  active?: boolean;
}

const PODIUM = [
  { ring: 'ring-1 ring-primary/30', label: '1.°' },
  { ring: 'ring-1 ring-border', label: '2.°' },
  { ring: 'ring-1 ring-border', label: '3.°' },
];

export function RankingScreen({ data, active = true }: RankingScreenProps) {
  const orderedRounds = useMemo(() => {
    const allRounds = sortRounds(data.rounds);
    return allRounds.filter((round) =>
      data.scores.some((score) => score.roundId === round.id && score.value !== null)
    );
  }, [data.rounds, data.scores]);

  const [selectedRoundIndex, setSelectedRoundIndex] = useState(
    Math.max(0, orderedRounds.length - 1)
  );

  const [revealedCount, setRevealedCount] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const previousRoundsCountRef = useRef(orderedRounds.length);

  // Sync selectedRoundIndex when rounds are added or removed
  useEffect(() => {
    const previousCount = previousRoundsCountRef.current;
    const previousLastIndex = Math.max(0, previousCount - 1);
    const newLastIndex = Math.max(0, orderedRounds.length - 1);

    setSelectedRoundIndex((currentIndex) => {
      if (orderedRounds.length > previousCount && currentIndex === previousLastIndex) {
        // Was viewing last round → advance to the new last round
        return newLastIndex;
      }
      // Otherwise clamp to a valid index (handles deletions)
      return Math.min(currentIndex, newLastIndex);
    });

    previousRoundsCountRef.current = orderedRounds.length;
  }, [orderedRounds.length]);

  const activeRounds = orderedRounds.slice(0, selectedRoundIndex + 1);
  const activeRoundIds = new Set(activeRounds.map((r) => r.id));
  const rankedTeams = assignRanks(calculateRanking(data, activeRoundIds));

  const hasPendingScores = rankedTeams.some((team) => !team.isComplete);
  const revealed = revealedCount > 0;

  const handleToggleReveal = useCallback(() => {
    if (rankedTeams.length === 0) return;

    if (revealedCount > 0) {
      setRevealedCount(0);
    } else {
      const lastIndex = rankedTeams.length - 1;
      if (itemRefs.current[lastIndex]) {
        // block: 'nearest' evita saltos iniciales bruscos; solo baja lo necesario para ver el último
        itemRefs.current[lastIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
        setTimeout(() => setRevealedCount(1), 1000);
      } else {
        setRevealedCount(1);
      }
    }
  }, [revealedCount, rankedTeams.length]);

  // Toggle reveal with the R key while the ranking screen is visible
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleToggleReveal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, handleToggleReveal]);

  // Secuencia de revelación (cuenta regresiva)
  useEffect(() => {
    if (revealedCount === 0 || revealedCount >= rankedTeams.length) return;

    const teamsLeft = rankedTeams.length - revealedCount;
    let delay = Math.max(600, 800 - rankedTeams.length * 15);

    if (teamsLeft === 3) delay = 1500;
    else if (teamsLeft === 2) delay = 2000;
    else if (teamsLeft === 1) delay = 3500;

    const timer = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [revealedCount, rankedTeams.length]);

  const targetScrollY = useRef<number | null>(null);

  // Cancelar el auto-scroll si el usuario mueve la rueda o toca la pantalla
  useEffect(() => {
    const stopTracking = () => {
      targetScrollY.current = null;
    };
    window.addEventListener('wheel', stopTracking, { passive: true });
    window.addEventListener('touchstart', stopTracking, { passive: true });
    return () => {
      window.removeEventListener('wheel', stopTracking);
      window.removeEventListener('touchstart', stopTracking);
    };
  }, []);

  // Bucle de animación para un scroll mantecoso y continuo (lerp)
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      if (targetScrollY.current !== null) {
        const currentY = window.scrollY;
        const targetY = targetScrollY.current;
        const diff = targetY - currentY;

        if (Math.abs(diff) > 1) {
          // Factor de suavizado (lerp). Menor = más lento y continuo.
          const step = diff * 0.05;
          window.scrollBy(0, step);
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Actualizar el objetivo del scroll cuando se revela un nuevo elemento
  useEffect(() => {
    if (revealedCount > 0 && revealedCount <= rankedTeams.length) {
      const currentIndex = rankedTeams.length - revealedCount;
      const el = itemRefs.current[currentIndex];

      if (el) {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Si el elemento revelado está por encima de la mitad de la pantalla,
        // actualizamos el objetivo del scroll para centrarlo.
        if (rect.top < viewportHeight * 0.5) {
          const absoluteY = rect.top + window.scrollY;
          // Calcular la posición Y que dejaría el elemento en el centro exacto
          targetScrollY.current = Math.max(0, absoluteY - viewportHeight / 2 + rect.height / 2);
        }
      }
    } else {
      // Detener el auto-scroll al ocultar todo
      if (revealedCount === 0) {
        targetScrollY.current = null;
      }
    }
  }, [revealedCount, rankedTeams.length]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          {data.showName !== false && (
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {data.name}
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
          onClick={handleToggleReveal}
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

      {/* Selector de ronda */}
      {orderedRounds.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs uppercase tracking-wide text-muted-foreground">
            Hasta
          </span>
          {orderedRounds.map((round, index) => (
            <Button
              key={round.id}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRoundIndex(index)}
              className={cn(
                'h-7 min-w-9 px-2 text-xs tabular-nums',
                selectedRoundIndex === index &&
                'bg-foreground text-background hover:bg-foreground/90 hover:text-background'
              )}
            >
              {round.name}
            </Button>
          ))}
        </div>
      )}

      {/* Advertencia general de puntajes pendientes */}
      {hasPendingScores && (
        <p className="mb-4 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
          ⚠ El ranking contiene equipos con puntajes pendientes.
        </p>
      )}

      {/* Ranking */}
      <ol className="flex flex-col gap-2.5">
        {rankedTeams.map((team, index) => {
          const podiumIndex = team.rank - 1;
          const podium = podiumIndex >= 0 && podiumIndex < 3 ? PODIUM[podiumIndex] : null;

          const isRevealed = index >= rankedTeams.length - revealedCount;

          return (
            <li
              key={team.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={cn(
                'animate-fade-in-up relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5',
                podium?.ring
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Hidden-state overlay */}
              <div
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-opacity duration-500',
                  isRevealed ? 'opacity-0' : 'opacity-100'
                )}
              >
                <Lock className="size-3.5" />
                Ranking oculto
              </div>

              <div
                className={cn(
                  'flex items-center gap-4 transition-all duration-700 ease-out',
                  isRevealed ? 'blur-0 opacity-100' : 'select-none blur-md opacity-40'
                )}
              >
                {/* Posición */}
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums',
                    team.rank === 1
                      ? 'border-primary/40 text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {team.rank}
                </span>

                {/* Equipo */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="truncate font-medium">{team.name}</p>
                    {podium && (
                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {podium.label}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {activeRounds.map((r) => (
                      <span key={r.id} className="tabular-nums">
                        {r.name}
                        <span className="ml-1 font-medium text-foreground/80">
                          {team.scores[r.id] ?? '-'}
                        </span>
                      </span>
                    ))}
                  </div>
                  {!team.isComplete && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {team.pendingRounds} resultado{team.pendingRounds !== 1 ? 's' : ''} pendiente
                      {team.pendingRounds !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-semibold tabular-nums sm:text-3xl">
                    {team.total}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {activeRounds.length} ronda{activeRounds.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {rankedTeams.length === 0 && (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Todavía no hay equipos. Agregalos en Ingreso de puntajes.
        </p>
      )}
    </div>
  );
}
