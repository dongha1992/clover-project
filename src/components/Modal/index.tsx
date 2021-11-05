import React from 'react';
import styled from 'styled-components';

type TProps = {
  children: React.ReactNode;
  closeModal?: () => void;
  style?: object;
  width?: string;
  height?: string;
  padding?: string;
  closeOnclickDimmer?: boolean;
};

export default function ModalLayout({
  children,
  closeModal,
  style,
  width,
  height,
  padding,
  closeOnclickDimmer,
}: TProps): JSX.Element {
  const handleClickDimmer = ({
    target,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>): void => {
    if (target !== currentTarget) {
      return;
    }
    closeOnclickDimmer && closeModal && closeModal();
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
}

const Dimmer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalBox = styled.div<{
  width?: string;
  height?: string;
  padding: string | undefined;
}>`
  position: relative;
  /* ${({ width }) => width && `width: ${width}`}; */
  width: 100%;
  max-width: 80%;
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
    color: gray;
    cursor: pointer;
  }
`;
