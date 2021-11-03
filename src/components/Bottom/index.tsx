import React from 'react';
import styled from 'styled-components';

function Bottom() {
  return <Container>바텀</Container>;
}

const Container = styled.div`
  width: 100%;
  max-width: 504px;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 10;
  height: 56px;
`;

export default Bottom;
