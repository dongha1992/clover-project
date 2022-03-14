import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const SoonPage = () => {
  return (
    <Container>
      <SingleMenu title="오픈예정" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default SoonPage;
