export function getRevealDelay(teamsRemaining: number, options?: {
  normalDelay?: number;
  thirdPlaceDelay?: number;
  secondPlaceDelay?: number;
  firstPlaceDelay?: number;
}): number {
  if (teamsRemaining === 3) return options?.thirdPlaceDelay ?? 1500;
  if (teamsRemaining === 2) return options?.secondPlaceDelay ?? 1900;
  if (teamsRemaining === 1) return options?.firstPlaceDelay ?? 2600;

  return options?.normalDelay ?? 900;
}
