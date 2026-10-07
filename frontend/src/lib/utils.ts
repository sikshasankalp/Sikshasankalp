export type ClassValue = string | number | bigint | boolean | undefined | null | Record<string, any> | ClassValue[] | any;

export function cn(...classes: any[]): string {
  const result: string[] = [];

  function process(item: any) {
    if (!item) return;
    if (typeof item === 'string' || typeof item === 'number') {
      result.push(String(item));
    } else if (Array.isArray(item)) {
      item.forEach(process);
    } else if (typeof item === 'object') {
      for (const [key, val] of Object.entries(item)) {
        if (val) result.push(key);
      }
    }
  }

  classes.forEach(process);
  return result.join(' ');
}
