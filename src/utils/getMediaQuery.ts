import { css, FlattenSimpleInterpolation } from 'styled-components';

export const breakpoints: { [index: string]: number } = {
  desktop: 1023,
  mobile: 503,
  sm: 360,
};

export const mediaQuery = Object.keys(breakpoints)
  .map((key) => [key, breakpoints[key]] as [string, number])
  .reduce((prev, [key]) => {
    prev[key] = (...args: string[]) => css`
      @media only screen and (max-width: ${breakpoints[key]}px) {
        ${args}
      }
    `;
    return prev;
  }, {} as { [index: string]: (...args: string[]) => any });
