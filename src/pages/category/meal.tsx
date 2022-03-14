import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const MealPage = () => {
  return (
    <Container>
      <SingleMenu title="도시락·간편식" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default MealPage;
