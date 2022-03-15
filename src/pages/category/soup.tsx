import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const SoupPage = () => {
  return (
    <Container>
      <SingleMenu title="죽" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default SoupPage;
