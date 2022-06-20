import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';

type TProps = {
  height?: number;
  width?: any;
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  ref?: React.ForwardedRef<HTMLDivElement>;
};

const BorderLine = (
  { height, width, margin, padding, backgroundColor }: TProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <Container
      height={height}
      width={width}
      margin={margin}
      padding={padding}
      ref={ref}
      backgroundColor={backgroundColor}
    />
  );
};

const Container = styled.div<{
  height?: number;
  width?: number;
  margin?: string;
  padding?: string;
  backgroundColor?: string;
}>`
  width: ${({ width }) => (width ? width : '100%')};
  max-width: ${breakpoints.mobile}px;
  background-color: ${({ theme, backgroundColor }) => (backgroundColor ? backgroundColor : theme.greyScale6)};
  height: ${({ height }) => (height ? height : 8)}px;
  margin: ${({ margin }) => margin && margin};
  padding: ${({ padding }) => padding && padding};
`;

export default React.forwardRef(BorderLine);
