export default function debounce<T extends any[]>(
  fn: (...args: T) => any,
  wait: number
): (...args: T) => void {
  let lastTimeoutId: NodeJS.Timeout | null = null;

  return (...args: T) => {
    if (lastTimeoutId) {
      clearTimeout(lastTimeoutId);
    }
    lastTimeoutId = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}