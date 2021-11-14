import React from 'react';
import styled from 'styled-components';
import SingleMenu from '@components/SingleMenu';

function category() {
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

export default React.memo(category);
