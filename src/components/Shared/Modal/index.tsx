import React, { useEffect } from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';
import { useDispatch } from 'react-redux';

type TProps = {
  children: React.ReactNode;
  closeModal?: () => void;
  style?: object;
  width?: string;
  height?: string;
  padding?: string;
  closeOnclickDimmer?: boolean;
};

/* TAYLER: bottom sheet 위에 alert 띄우는 것 때문에 Dimmer z-index 변경했는데 혹시 문제 되면 말씀해주세요. */

const ModalLayout = ({
  children,
  closeModal,
  style,
  width,
  height,
  padding,
}: TProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleClickDimmer = ({
    target,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>): void => {
    if (target !== currentTarget) {
      return;
    }
  };
  return (
    <Dimmer onClick={handleClickDimmer}>
      <ModalBox style={style} height={height} padding={padding}>
        {closeModal && (
          <div onClick={closeModal} className="btnClose">
            닫기
          </div>
        )}
        {children}
      </ModalBox>
    </Dimmer>
  );
};

const Dimmer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: calc(50%);
  right: 0px;
  bottom: 0px;
  max-width: ${breakpoints.mobile}px;
  height: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);

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
  width?: string;
  height?: string;
  padding: string | undefined;
}>`
  position: relative;
  max-width: ${breakpoints.mobile}px;
  width: 80%;
  ${({ height }) => height && `height: ${height}`}
  padding: ${({ padding }) => (padding ? padding : `10px`)};
  border-radius: 3px;
  background-color: white;
  box-shadow: -14px -14px 20px rgba(0, 0, 0, 0.02),
    14px 14px 20px rgba(0, 0, 0, 0.05);
  z-index: 11;
  box-sizing: border-box;

  .btnClose {
    position: absolute;
    top: 0;
    right: 0;
    width: 31px;
    height: 21px;
    margin: 5%;
    color: grey;
    cursor: pointer;
  }
`;

export default ModalLayout;
