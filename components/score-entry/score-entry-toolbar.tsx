'use client';

import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScoreEntryToolbarProps {
  searchQuery: string;
  newTeamName: string;
  onSearchChange: (value: string) => void;
  onNewTeamNameChange: (value: string) => void;
  onAddTeam: () => void;
  onAddRound: () => void;
}

export function ScoreEntryToolbar({
  searchQuery,
  newTeamName,
  onSearchChange,
  onNewTeamNameChange,
  onAddTeam,
  onAddRound,
}: ScoreEntryToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap justify-between gap-2">
      {/* Búsqueda */}
      <div className="flex min-w-[200px] max-w-sm flex-1 gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar equipo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full pl-9"
          />
        </div>
      </div>

      {/* Agregar equipo y ronda */}
      <div className="flex min-w-[200px] flex-1 justify-end gap-2">
        <Input
          placeholder="Agregar equipo…"
          value={newTeamName}
          onChange={(e) => onNewTeamNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onAddTeam();
            }
          }}
          className="h-9 flex-1"
        />
        <Button onClick={onAddTeam} size="sm" className="h-9 shrink-0 gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Agregar equipo</span>
        </Button>
      </div>

      <Button onClick={onAddRound} size="sm" variant="outline" className="h-9 gap-1.5">
        <Plus className="size-4" aria-hidden="true" />
        <span>Agregar ronda</span>
      </Button>
    </div>
  );
}
