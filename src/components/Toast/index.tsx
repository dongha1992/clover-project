import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { toastSelector } from '@store/toast';
import { useSelector } from 'react-redux';
import { TextH5B } from '@components/Text';
import { theme } from '@styles/theme';

/* TODO: width 조절 */
const Toast = (): JSX.Element | null => {
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const toastConfig = useSelector(toastSelector);

  const showToast = (duration: number): void => {
    if (isFirstRender || duration === 0) {
      return;
    }
    setIsToastOpen(true);

    setTimeout(() => {
      setIsToastOpen(false);
    }, duration);
  };

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    showToast(toastConfig.duration ?? 100000);
  }, [toastConfig]);

  if (!isToastOpen) {
    return null;
  }
  return (
    <ToastContainer
      duration={toastConfig.duration ?? 100000}
      // dangerouslySetInnerHTML={{ __html: toastConfig.message }}
    >
      <TextContainer>
        <TextH5B color={theme.white}>{toastConfig.message}</TextH5B>
      </TextContainer>
    </ToastContainer>
  );
};

const ToastContainer = styled.div<{ duration: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  right: 0px;
  bottom: 0px;
  left: calc(50% + 28px);
  width: 80%;
  height: 48px;
  max-width: 504px;
  text-align: center;
  padding: 13px 16px;
  background: rgba(36, 36, 36, 0.9);
  border-radius: 8px;
  z-index: 10;
  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 50%;
    margin-left: -252px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  animation: fadeIn 0.3s ease-in,
    fadeOut 0.3s ${({ duration }) => duration / 1000 - 0.3}s ease-in;
`;

const TextContainer = styled.div`
  z-index: 11;
`;

export default Toast;
