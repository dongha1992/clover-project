import type { NextPage } from 'next';
import styled, { css } from 'styled-components';
import { useMediaQuery } from '@hooks/useMediaQuery';

const Home: NextPage = () => {
  return (
    <Container>
      <Left>레프트</Left>
      <Right>라이트</Right>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const Left = styled.main`
  display: ${({ theme }) => (theme.isWithContentsSection ? 'flex' : 'none')};
  width: 100%;
`;
const Right = styled.main`
  ${({ theme }) => {
    if (theme.isWithContentsSection) {
      return css`
        display: flex;
        justify-content: center;
      `;
    }
  }}
`;

export default Home;
