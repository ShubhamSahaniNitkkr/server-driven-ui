export function isFeatureEnabled(
  flags: Record<string, boolean>,
  flag?: string,
): boolean {
  if (!flag) return true;
  return flags[flag] ?? false;
}
