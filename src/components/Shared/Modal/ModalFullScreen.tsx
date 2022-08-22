import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { theme } from '@styles/theme';

type TProps = {
  children: React.ReactNode;
  closeModal?: () => void;
  style?: object;
  height?: string;
  padding?: string;
  closeOnclickDimmer?: boolean;
  isShow?: boolean
};

const ModalFullScreen = ({ children, style, height, padding }: TProps): JSX.Element => {
  const handleClickDimmer = ({ target, currentTarget }: React.MouseEvent<HTMLDivElement>): void => {
    if (target !== currentTarget) {
      return;
    }
  };

  return (
    <Dimmer onClick={handleClickDimmer}>
      <ModalBox style={style} height={height} padding={padding}>
        {children}
      </ModalBox>
    </Dimmer>
  );
};

const Dimmer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: calc(50%);
  right: 0px;
  bottom: 0px;
  max-width: ${breakpoints.mobile}px;
  height: 100vh;
  z-index: 1000000;
  background-color: ${theme.black};
  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const ModalBox = styled.div<{
  height?: string;
  padding: string | undefined;
}>`
  position: relative;
  max-width: ${breakpoints.mobile}px;
  width: 100%;
  /* height: ${({ height }) => height && `${height}`}; */
  /* padding: ${({ padding }) => (padding ? padding : `10px`)}; */
  z-index: 11;
  box-sizing: border-box;
`;

export default ModalFullScreen;
