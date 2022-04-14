import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const SnackPage = () => {
  return (
    <Container>
      <SingleMenu title="간식" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default SnackPage;
