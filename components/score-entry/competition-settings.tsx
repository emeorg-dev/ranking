'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface CompetitionSettingsProps {
  name: string;
  showName: boolean;
  onUpdateName: (name: string) => void;
  onToggleShowName: (checked: boolean) => void;
}

export function CompetitionSettings({
  name,
  showName,
  onUpdateName,
  onToggleShowName,
}: CompetitionSettingsProps) {
  return (
    <div className="mb-4 max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <Label htmlFor="competition-name" className="text-sm font-semibold">
          Nombre de la competencia
        </Label>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="show-name"
            className="cursor-pointer text-xs text-muted-foreground"
          >
            Mostrar nombre
          </Label>
          <Switch
            id="show-name"
            checked={showName}
            onCheckedChange={onToggleShowName}
          />
        </div>
      </div>
      <Input
        id="competition-name"
        value={name}
        onChange={(e) => onUpdateName(e.target.value)}
        disabled={!showName}
        className="h-auto px-3 py-2 text-lg font-medium shadow-none sm:text-xl"
        aria-label="Nombre de la competencia"
      />
    </div>
  );
}
