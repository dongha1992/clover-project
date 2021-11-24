import React from 'react';
import styled from 'styled-components';

type TProps = {
  height?: number;
  margin?: string;
  padding?: string;
};

function BorderLine({ height, margin, padding }: TProps) {
  return <Container height={height} margin={margin} padding={padding} />;
}

const Container = styled.div<{
  height?: number;
  margin?: string;
  padding?: string;
}>`
  width: 100%;
  max-width: 504px;
  background-color: ${({ theme }) => theme.greyScale3};
  height: ${({ height }) => (height ? height : 8)}px;
  margin: ${({ margin }) => margin && margin};
  padding: ${({ padding }) => padding && padding};
`;

export default BorderLine;
