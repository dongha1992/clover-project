import React from 'react';
import styled from 'styled-components';
import SingleMenu from '@components/Pages/Category/SingleMenu';

function CategoryPage() {
  return (
    <Container>
      <SingleMenu category="/" />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 52px 24px;
`;

export default React.memo(CategoryPage);
