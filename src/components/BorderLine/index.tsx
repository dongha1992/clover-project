import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';

type TProps = {
  height?: number;
  margin?: string;
  padding?: string;
  ref?: React.ForwardedRef<HTMLDivElement>;
};

function BorderLine(
  { height, margin, padding }: TProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <Container height={height} margin={margin} padding={padding} ref={ref} />
  );
}

const Container = styled.div<{
  height?: number;
  margin?: string;
  padding?: string;
}>`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  background-color: ${({ theme }) => theme.greyScale6};
  height: ${({ height }) => (height ? height : 8)}px;
  margin: ${({ margin }) => margin && margin};
  padding: ${({ padding }) => padding && padding};
`;

export default React.forwardRef(BorderLine);
