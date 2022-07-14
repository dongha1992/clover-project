import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';

const Empty = () => {
  return (
    <Container>
      <TextB2R color={theme.greyScale65}>필터 검색 결과가 없어요.</TextB2R>
      <TextB2R color={theme.greyScale65}>다른 필터로 검색해 보세요. 😭</TextB2R>
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
