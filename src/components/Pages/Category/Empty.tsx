import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';

const Empty = () => {
  return (
    <Container>
      <TextB2R color={theme.greyScale65}>상품을 준비 중이에요. 😭</TextB2R>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default Empty;
