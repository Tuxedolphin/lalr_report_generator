export function getItem(key: string): string {
  return !localStorage.getItem(key) ? "" : localStorage.getItem(key)!;
}
