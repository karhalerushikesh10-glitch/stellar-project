/**
 * A highly optimized memoization utility for expensive transaction builder operations.
 * Caches results based on stringified arguments.
 * 
 * @param fn The function to memoize
 * @param ttl Time to live in milliseconds (default 5000ms)
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 5000
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, { value: ReturnType<T>, expiry: number }>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cachedItem = cache.get(key);

    if (cachedItem && cachedItem.expiry > now) {
      return cachedItem.value;
    }

    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ttl });
    
    // Lazy cleanup of expired entries
    if (cache.size > 100) {
      for (const [k, v] of cache.entries()) {
        if (v.expiry <= now) cache.delete(k);
      }
    }

    return result;
  };
}