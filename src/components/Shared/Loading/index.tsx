import styled from 'styled-components';
import Lottie from 'lottie-react';
import loadingAnimation from '@public/images/loading.json';
import { theme } from '@styles/theme';

export const Loading = ({ isShow = false }) => {
  return (
    <Overlay style={{ display: isShow ? 'flex' : 'none' }}>
      <Lottie animationData={loadingAnimation} style={{ width: 60, height: 60 }} />
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  text-align: center;
  font-size: 1.2em;
  z-index: 99999;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.5);
`;

export default Loading;
