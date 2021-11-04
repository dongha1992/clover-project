import type { NextPage } from 'next';
import styled, { css } from 'styled-components';
import Home from '@components/Home';

const index: NextPage = () => {
  return (
    <Container>
      <Home />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
`;

export default index;
