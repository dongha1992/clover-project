import React from 'react';
import styled from 'styled-components';
import { SingleMenu } from '@components/Pages/Category';
import { categoryPageSet } from '@styles/theme';

const WrapPage = () => {
  return (
    <Container>
      <SingleMenu title="랩·샌드위치" />
    </Container>
  );
};

const Container = styled.div`
  ${categoryPageSet}
`;

export default WrapPage;
