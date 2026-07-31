'use client';

import { useLanguage } from '@/components/language/language-provider';
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
  const { t } = useLanguage();

  return (
    <div className="mb-4 max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <Label htmlFor="competition-name" className="text-sm font-semibold">
          {t('ranking.settings.competitionName')}
        </Label>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="show-name"
            className="cursor-pointer text-xs text-muted-foreground"
          >
            {t('ranking.settings.showName')}
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
        aria-label={t('ranking.settings.competitionName')}
      />
    </div>
  );
}
