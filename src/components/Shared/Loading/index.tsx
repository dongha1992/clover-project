import styled from 'styled-components';
import Lottie from 'react-lottie';
import test from '@public/images/test1.json';

export const Loading = ({isShow=false}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: test,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Overlay style={{display: isShow ? 'flex' : 'none'}}>
      <Lottie options={defaultOptions} height={100} width={100} />
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
