import React from 'react';
import styled from 'styled-components';

function index() {
  return <Container></Container>;
}

const Container = styled.div`
  width: 100%;
  max-width: 504px;
  background-color: ${({ theme }) => theme.greyScale3};
  height: 8px;
`;

export default index;
