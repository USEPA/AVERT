export type EmptyObject = Record<string, never>;

/**
 * Return an object, sorted alphabetically by it's keys
 */
export function sortObjectByKeys<T extends Record<string, unknown>>(object: T) {
  return (Object.keys(object) as (keyof T)[]).sort().reduce((result, key) => {
    result[key] = object[key];
    return result;
  }, {} as T);
}
