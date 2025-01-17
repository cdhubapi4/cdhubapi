export class CacheMap {
  private cache: Map<string, { value: number | object[]; expirationDate: number }>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Save data to cache.
   *
   * @param key - The cache key.
   * @param value - The value to store.
   * @param durationValue - The number representing the duration (e.g., 2).
   * @param durationType - The type of the duration ('second', 'minute', 'hour', 'day'). Default is 'second'.
   */
  public set(
    key: string,
    value: number | object[] | any,
    durationType: "second" | "minute" | "hour" | "day" = "day",
    durationValue: number
  ): void {
    let durationInMilliseconds = 0;

    switch (durationType) {
      case "second":
        durationInMilliseconds = durationValue * 1000;
        break;
      case "minute":
        durationInMilliseconds = durationValue * 60 * 1000;
        break;
      case "hour":
        durationInMilliseconds = durationValue * 60 * 60 * 1000;
        break;
      case "day":
        durationInMilliseconds = durationValue * 24 * 60 * 60 * 1000;
        break;
      default:
        throw new Error("Invalid duration type.");
    }

    const expirationDate = Date.now() + durationInMilliseconds;
    this.cache.set(key, { value, expirationDate });
  }

  /**
   * Retrieve data from cache.
   *
   * @param key - The cache key.
   * @returns The stored value or null if not found or expired.
   */
  public get(key: string): number | object[] | null {
    const data = this.cache.get(key);
    if (!data) return null;

    // Check expiration date
    if (data.expirationDate < Date.now()) {
      this.cache.delete(key); // Remove expired data from cache
      return null;
    }
    return data.value;
  }
}

export default CacheMap;
