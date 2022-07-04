import React from 'react';
import styled from 'styled-components';
import { fixedBottom, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/common/getMediaQuery';

interface IProps {
  leftButtonHandler: () => void;
  rightButtonHandler: () => void;
  leftText: string;
  rightText: string;
}

const ButtonGroup = React.memo(({ leftButtonHandler, rightButtonHandler, leftText, rightText }: IProps) => {
  return (
    <BtnWrapper>
      <Button height="100%" width="100%" borderRadius="0" onClick={leftButtonHandler}>
        {leftText}
      </Button>
      <Col />
      <Button height="100%" width="100%" borderRadius="0" onClick={rightButtonHandler}>
        {rightText}
      </Button>
    </BtnWrapper>
  );
});

const BtnWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  left: 50%;
  right: 0px;
  z-index: 10;
  height: 56px;
  left: 50%;
  background-color: ${({ theme }) => theme.black};
  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const Col = styled.div`
  position: absolute;
  left: 50%;
  bottom: 25%;
  background-color: ${theme.white};
  width: 1px;
  height: 50%;
`;

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
