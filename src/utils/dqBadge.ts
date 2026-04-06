export function getDQBadgeColor(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 85) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
}

export function getDQTagColor(score: number): string {
  if (score >= 85) return 'green';
  if (score >= 60) return 'gold';
  return 'red';
}
