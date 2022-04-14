import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const DrinkPage = () => {
  return (
    <Container>
      <SingleMenu title="음료" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default DrinkPage;
