import type { NextPage } from 'next';
import styled, { css } from 'styled-components';
import Home from '@components/Home';
import Bottom from '@components/Bottom';
import Header from '@components/Header';

const index: NextPage = () => {
  return (
    <Container>
      <Left>광고</Left>
      <Right>
        <Header />
        <Home />
        <Bottom />
      </Right>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  ${({ theme }) => {
    if (!theme.isWithContentsSection) {
      return css`
        width: 100%;
        justify-content: center;
        background-color: gray;
      `;
    }
  }}
`;

const Left = styled.main`
  display: ${({ theme }) => (theme.isWithContentsSection ? 'flex' : 'none')};
  width: 100%;
`;

const Right = styled.main`
  ${({ theme }) => {
    if (!theme.isWithContentsSection) {
      return css`
        display: flex;
      `;
    }
  }}
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 504px;
  min-width: 360px;
  background-color: yellow;
`;

export default index;
