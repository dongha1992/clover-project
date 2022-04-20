import { css, FlattenSimpleInterpolation } from 'styled-components';

export const breakpoints: { [index: string]: number } = {
  full: 1440,
  desktop: 1024,
  mobile: 512,
  sm: 320,
};

const getMediaQuery = Object.keys(breakpoints)
  .map((key) => [key, breakpoints[key]] as [string, number])
  .reduce((prev, [key]) => {
    prev[key] = (...args: string[]) => css`
      @media only screen and (max-width: ${breakpoints[key]}px) {
        ${args}
      }
    `;
    return prev;
  }, {} as { [index: string]: (...args: string[]) => any });

export default getMediaQuery;
