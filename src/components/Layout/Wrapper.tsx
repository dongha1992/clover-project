import React, { useEffect } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { alertForm } from '@store/alert';
import { toastSelector } from '@store/toast';
import { bottomSheetForm } from '@store/bottomSheet';
import { useSelector } from 'react-redux';
import Header from '@components/Header';
import Bottom from '@components/Bottom';
import { breakpoints } from '@utils/common/getMediaQuery';
import { commonSelector } from '@store/common';
import Loading from '@components/Shared/Loading';
import { AppState } from '@store/index';
// import Alert from '@components/Shared/Alert';
// import BottomSheet from '@components/BottomSheet';
// import Toast from '@components/Shared/Toast';
// import ImageViewer from '@components/ImageViewer';

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
  const alert = useSelector(alertForm);
  const bottomSheet = useSelector(bottomSheetForm);
  const toast = useSelector(toastSelector);
  const { imagesForViewer } = useSelector(commonSelector);
  const loadingState = useSelector((state: AppState) => state.loading);

  const isClickReviewImg = imagesForViewer?.images?.length > 0;

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
      <Container>
        <Center>
          <Loading isShow={loadingState?.isShown}></Loading>
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
          {isClickReviewImg && <ImageViewer imagesForViewer={imagesForViewer} />}
          <Left>
            <div className="left-contents">
              {/* <Image
                src="https://s3.ap-northeast-2.amazonaws.com/freshcode/img/seo/main.png"
                layout="responsive"
                objectFit="cover"
                width={512}
              /> */}
            </div>
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
  background-color: #f4f4f4;
  /* width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch; */
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
  &::-webkit-scrollbar {
    display: none;
  }
  /* TODO: background image 어떻게 할까 */
  /* background-image: url('https://s3.ap-northeast-2.amazonaws.com/freshcode/img/seo/main.png'); */
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
`;

const Right = styled.div`
  /* clip-path: inset(0 0 0 0); */
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
  position: relative;
  /* z-index: 999; */
  background-color: white;
  width: 50%;
  ${({ theme }) => theme.desktop`  
  display: none;
  `}
`;

const Main = styled.main`
  margin: 56px 0 0 0;
  width: 100%;
  min-height: calc(100vh - 112px);
`;

export default Wrapper;
