import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { alertForm } from '@store/alert';
import { toastSelector } from '@store/toast';
import { useSelector } from 'react-redux';
import { imageViewerSelector } from '@store/imageViewer';
import Header from '@components/Header';
import { breakpoints } from '@utils/common/getMediaQuery';
import Loading from '@components/Shared/Loading';
import { AppState } from '@store/index';
import Alert from '@components/Shared/Alert';
import Toast from '@components/Shared/Toast';
import BottomSheet from '@components/BottomSheet';
import ImageViewer from '@components/ImageViewer';
import { bottomSheetForm } from '@store/bottomSheet';
import NextImage from 'next/image';
import { commonSelector } from '@store/common';

interface IDefaultLayoutProps {
  children: ReactElement;
  bottom?: ReactElement;
}
const DefaultLayout = ({ children, bottom }: IDefaultLayoutProps) => {
  const alert = useSelector(alertForm);
  const bottomSheet = useSelector(bottomSheetForm);
  const toast = useSelector(toastSelector);
  const imageViewerState = useSelector(imageViewerSelector);
  const loadingState = useSelector((state: AppState) => state.loading);

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
    <>
      <BackgroundImg />
      <Container>
        <Center>
          {alert && (
            <Alert
              alertMessage={alert.alertMessage}
              alertSubMessage={alert.alertSubMessage}
              submitBtnText={alert.submitBtnText}
              closeBtnText={alert.closeBtnText}
              onSubmit={alert.onSubmit}
              onClose={alert.onClose}
              type={alert.type}
              setSelectedMenu={alert.setSelectedMenu}
              selectedMenu={alert.selectedMenu}
            >
              {alert.children}
            </Alert>
          )}
          <ImageViewer
            images={imageViewerState.images}
            startIndex={imageViewerState.startIndex}
            isShow={imageViewerState.isShow}
          />
          <Left>
            <div className="left-contents">
              <NextImage
                src="/images/img_brandstory_desktop.png"
                width="401px"
                height="381px"
                alt="???????????? ???????????????"
              />
            </div>
          </Left>
          <Right id="right">
            <Loading isShow={loadingState?.isShown}></Loading>
            <Header />
            {toast.message && <Toast />}
            <Main>{children}</Main>
            <BottomWrapper isShow={!!bottom}>{bottom}</BottomWrapper>
          </Right>
        </Center>
      </Container>
      {bottomSheet?.content && <BottomSheet />}
    </>
  );
};
const BackgroundImg = styled.div`
  background: url('/images/backgroundImg.png') no-repeat bottom;
  background-size: cover;
  position: fixed;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.desktop`  
    display: none;
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* max-height: 100vh; */
  box-sizing: border-box;
  background-color: tff;
`;

const Center = styled.div`
  position: relative;
  background-color: transparent;
  display: flex;
  width: 100%;
  max-width: ${breakpoints.desktop}px;
  height: 100%;
  min-height: calc(var(--vh, 1vh) * 100);
  --ms-overflow-style: none;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
`;

const Right = styled.div`
  position: relative;
  /* overflow-y: scroll; */
  width: 50%;
  max-width: ${breakpoints.mobile}px;
  background-color: white;
  @media (min-width: 512px) {
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
    width: 100%;
    max-width: 512px;
  `};
`;

const Left = styled.div`
  position: relative;
  width: 512px;
  display: flex;
  align-items: center;
  justify-content: center;
  .left-contents {
    position: fixed;
    width: 512px;
    height: 100vh;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    /* object-fit: contain; */
  }
  ${({ theme }) => theme.desktop`  
    display: none;
  `}
`;

const Main = styled.main`
  margin: 56px 0 0 0;
  width: 100%;
  min-height: calc(100vh - 112px);
`;

const BottomWrapper = styled.div<{ isShow: React.ReactNode }>`
  margin-top: ${({ isShow }) => (isShow ? 56 : 0)}px;
  display: ${({ isShow }) => (isShow ? '' : 'none')};
  background-color: white;
`;

export default DefaultLayout;
