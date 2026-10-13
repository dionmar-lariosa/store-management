const TransformUtil = {
  omit<T extends Record<string, unknown>, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> {
    const copy = { ...object };

    for (const key of keys) {
      delete copy[key];
    }

    return copy;
  }
};

export default TransformUtil;
