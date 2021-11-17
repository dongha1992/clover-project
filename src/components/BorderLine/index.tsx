import React from 'react';
import styled from 'styled-components';

type TProps = {
  height?: number;
  margin?: string;
};

function BorderLine({ height, margin }: TProps) {
  return <Container height={height} margin={margin} />;
}

const Container = styled.div<{ height?: number; margin?: string }>`
  width: 100%;
  max-width: 504px;
  background-color: ${({ theme }) => theme.greyScale3};
  height: ${({ height }) => (height ? height : 8)}px;
  margin: ${({ margin }) => (margin ? margin : 0)}px; ;
`;

export default BorderLine;
