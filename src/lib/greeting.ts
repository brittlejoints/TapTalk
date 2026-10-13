/**
 * Time-of-day greeting. Pure function so it's easy to test; name is optional
 * so a user who hasn't set theirs still gets a friendly line.
 */
export type DayPeriod = 'morning' | 'afternoon' | 'evening';

export function periodFor(hour: number): DayPeriod {
  return hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
}

export function greetingFor(hour: number, name?: string): string {
  const period = periodFor(hour);
  const base = period === 'morning' ? 'Good morning' : period === 'afternoon' ? 'Good afternoon' : 'Good evening';
  const trimmed = name?.trim();
  return trimmed ? `${base}, ${trimmed}` : base;
}

/** Current greeting for right now. */
export function greetingNow(name?: string): string {
  return greetingFor(new Date().getHours(), name);
}
