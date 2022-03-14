import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const SaladPage = () => {
  return (
    <Container>
      <SingleMenu title="샐러드" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default SaladPage;
