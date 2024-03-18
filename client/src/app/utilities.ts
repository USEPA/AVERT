import { css } from '@emotion/react';
// ---
import icons from '@/app/icons.svg';

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

/**
 * Styles used for tooltip modal links
 */
export const modalLinkStyles = css`
  left: 1px;
  bottom: -3px;
  border-radius: 50%;
  background-image: url(${icons});
  background-size: 400px 200px;
  background-position: -10px -10px;
  /* hide text */
  text-indent: 400%;
  white-space: nowrap;
  overflow: hidden;
`;
