import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const CategoryPage = () => {
  return (
    <Container>
      <SingleMenu title="전체" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default React.memo(CategoryPage);
