import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Alert from '@components/Alert';
import { alertForm } from '@store/alert';
import { cartForm } from '@store/cart';
import { toastSelector } from '@store/toast';
import { bottomSheetForm } from '@store/bottomSheet';
import { useSelector } from 'react-redux';
import Header from '@components/Header';
import Bottom from '@components/Bottom';

// import BottomLayer from '@components/BottomSheet/BottomLayer';

const BottomSheet = dynamic(() => import('@components/BottomSheet'), {
  ssr: false,
});
const Toast = dynamic(() => import('@components/Toast'), {
  ssr: false,
});

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

  const alert = useSelector(alertForm);
  const bottomSheet = useSelector(bottomSheetForm);
  const cart = useSelector(cartForm);
  const toast = useSelector(toastSelector);
  return (
    <>
      <Container>
        <Center>
          {alert && (
            <Alert
              alertMessage={alert.alertMessage}
              submitBtnText={alert.submitBtnText}
              closeBtnText={alert.closeBtnText}
              onSubmit={alert.onSubmit}
              onClose={alert.onClose}
              type={alert.type}
              setSelectedMenu={alert.setSelectedMenu}
              selectedMenu={alert.selectedMenu}
            />
          )}
          {toast && <Toast />}
          <Left>
            <div className="left-contents">광고</div>
          </Left>
          <Right>
            <Header />
            <Main>{children}</Main>
            <Bottom />
          </Right>
        </Center>
      </Container>
      {bottomSheet?.content && <BottomSheet />}
    </>
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

const Main = styled.main`
  margin-top: 56px;
`;
