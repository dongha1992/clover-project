import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { toastSelector } from '@store/toast';
import { useSelector } from 'react-redux';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/common/getMediaQuery';

const Toast = (): JSX.Element | null => {
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const toastConfig = useSelector(toastSelector);

  const showToast = (duration: number): void => {
    /* TODO: isFirstRender? */
    if (duration === 0) {
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
    showToast(toastConfig.duration ?? 3000);
  }, [toastConfig]);

  if (!isToastOpen) {
    return null;
  }
  return (
    <ToastContainer
      duration={toastConfig.duration ?? 3000}
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
  left: calc(54%);
  width: calc((${breakpoints.desktop}px / 2) * 0.8);
  height: 48px;
  /* max-width: ${breakpoints.mobile}px; */
  text-align: center;
  padding: 13px 16px;
  background: rgba(36, 36, 36, 0.9);
  border-radius: 8px;
  /* margin: 0 auto; */
  z-index: 1000;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    width:80%;
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

  animation: fadeIn 0.3s ease-in, fadeOut 0.3s ${({ duration }) => duration / 1000 - 0.3}s ease-in;
`;

const TextContainer = styled.div`
  z-index: 11;
`;

export default Toast;
