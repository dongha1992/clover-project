import { homePadding } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';

function profile() {
  return (
    <Container>
      <Wrapper></Wrapper>
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;
const Wrapper = styled.div``;
export default profile;
