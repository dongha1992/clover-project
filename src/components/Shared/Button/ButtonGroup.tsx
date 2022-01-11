import React from 'react';
import styled from 'styled-components';
import { fixedBottom, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';

interface IProps {
  leftButtonHandler: () => void;
  rightButtonHandler: () => void;
  leftText: string;
  rightText: string;
}

const ButtonGroup = React.memo(
  ({ leftButtonHandler, rightButtonHandler, leftText, rightText }: IProps) => {
    return (
      <BtnWrapper>
        <Button
          height="100%"
          width="100%"
          borderRadius="0"
          onClick={leftButtonHandler}
        >
          {leftText}
        </Button>
        <Col />
        <Button
          height="100%"
          width="100%"
          borderRadius="0"
          onClick={rightButtonHandler}
        >
          {rightText}
        </Button>
      </BtnWrapper>
    );
  }
);

const BtnWrapper = styled.div`
  ${fixedBottom}
  display: flex;
`;

const Col = styled.div`
  position: absolute;
  left: 50%;
  bottom: 25%;
  background-color: ${theme.white};
  width: 1px;
  height: 50%;
`;

export default ButtonGroup;
