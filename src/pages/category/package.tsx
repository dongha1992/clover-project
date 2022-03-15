import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const PackagePage = () => {
  return (
    <Container>
      <SingleMenu title="세트상품" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default PackagePage;
