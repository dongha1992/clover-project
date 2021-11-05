import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';

export const Wrapper: React.FC = ({ children }) => {
  // set 1vh for all devices
  useEffect(() => {
    const calcBrowserScreenSize = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    calcBrowserScreenSize();

    window.addEventListener('resize', calcBrowserScreenSize);
    return () => window.removeEventListener('resize', calcBrowserScreenSize);
  }, []);

  return (
    <Container>
      <Center>
        <Left>
          <div className="left-contents">광고</div>
        </Left>
        <Right>{children}</Right>
      </Center>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background-color: gray;
`;

const Center = styled.div`
  background-color: white;
  display: flex;
  width: 100%;
  max-width: 1024px;
  height: 100%;
  min-height: calc(var(--vh, 1vh) * 100);
  --ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Right = styled.div`
  position: relative;
  width: 100%;
  max-width: 504px;
  left: 50%;
  background-color: white;
  padding-bottom: 62px;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    width: 100%;
    left:0px;
    width:100%;
    max-width: 504px;
  `};
`;

const Left = styled.div`
  left: 50%;
  ${({ theme }) => theme.desktop`  
  display: none;
  `}
`;
