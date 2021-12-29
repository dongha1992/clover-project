import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { alertForm } from '@store/alert';
import { cartForm } from '@store/cart';
import { toastSelector } from '@store/toast';
import { bottomSheetForm } from '@store/bottomSheet';
import { useSelector } from 'react-redux';
import Header from '@components/Header';
import Bottom from '@components/Bottom';
import { breakpoints } from '@utils/getMediaQuery';
import { commonSelector } from '@store/common';

const Alert = dynamic(() => import('@components/Shared/Alert'), {
  ssr: false,
});

const BottomSheet = dynamic(() => import('@components/BottomSheet'), {
  ssr: false,
});

const Toast = dynamic(() => import('@components/Shared/Toast'), {
  ssr: false,
});

const ImageViewer = dynamic(() => import('@components/ImageViewer'));

const Wrapper: React.FC = ({ children }) => {
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

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
        window.Kakao.init('3b920f79f2efe4b9c764ae1ea79f6fa8');
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const alert = useSelector(alertForm);
  const bottomSheet = useSelector(bottomSheetForm);
  const cart = useSelector(cartForm);
  const toast = useSelector(toastSelector);
  const { isModalOn, imagesForViewer } = useSelector(commonSelector);

  const isClickReviewImg = imagesForViewer.length > 0;

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
              children={alert.children}
            />
          )}
          {isClickReviewImg && <ImageViewer images={imagesForViewer} />}
          <Left>
            <div className="left-contents">광고</div>
          </Left>
          <Right>
            <Header />
            {toast.message && <Toast />}
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
  background-color: grey;
`;

const Center = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  width: 100%;
  max-width: ${breakpoints.desktop}px;
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
  width: 50%;
  max-width: ${breakpoints.mobile}px;
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
    width: 100%;
    max-width: 512px;
  `};
`;

const Left = styled.div`
  width: 50%;
  ${({ theme }) => theme.desktop`  
  display: none;
  `}
`;

const Main = styled.main`
  margin: 56px 0;
`;

export default Wrapper;
