import styled from 'styled-components';
import Lottie from "lottie-react";
import loadingAnimation from '@public/images/loading.json';

export const Loading = ({isShow=false}) => {
  return (
    <Overlay style={{display: isShow ? 'flex' : 'none'}}>
      <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
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
`;

export default Loading;
