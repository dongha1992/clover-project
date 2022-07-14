import React from 'react';
import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';

/*TODO: 확장성 고려해서 리팩토링 */
/*TODO: minWitdh 수정해야함 */
interface ITooltip {
  message: string;
  top?: string;
  bottom?: string;
  width?: string;
  left?: string;
  isBottom?: boolean;
}

const Tooltip = ({ message, top, width, bottom, left, isBottom }: ITooltip): JSX.Element | null => {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  const showTooltip = (): void => {
    setIsTooltipOpen(true);
  };

  const hideToolTip = (): void => {
    setIsTooltipOpen(false);
  };

  useEffect(() => {
    showTooltip();
  }, [message]);

  if (!isTooltipOpen) {
    return null;
  }

  return (
    <TooltipContainer top={top} width={width} bottom={bottom} left={left}>
      <TextContainer isBottom={isBottom}>
        <TextH6B color={theme.white}>{message}</TextH6B>
        <div onClick={hideToolTip} className="svg">
          <SVGIcon name="whiteCancel" />
        </div>
      </TextContainer>
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div<{
  top?: string;
  bottom?: string;
  width?: string;
  left?: string;
}>`
  display: flex;
  position: absolute;
  cursor: pointer;
  top: ${({ top }) => top && top};
  width: ${({ width }) => width && width};
  right: 0px;
  left: 0px;
  bottom: ${({ bottom }) => bottom && bottom};
  text-align: center;
  margin-left: ${({ left }) => left && left};

  background: rgba(36, 36, 36, 0.9);
  border-radius: 8px;
  z-index: 9;

  ${({ theme }) => theme.desktop`
    left: 0px;
  `};

  ${({ theme }) => theme.mobile`
    left: 0px;
  `};
`;

const TextContainer = styled.div<{ isBottom?: boolean }>`
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;

  .svg {
    padding-left: 12px;
  }
  &::after {
    content: '';
    position: absolute;
    left: 10%;
    transform: translateX(-10%);
    width: 0px;
    height: 0px;

    ${({ isBottom }) => {
      if (isBottom) {
        return css`
          border-top: 4px solid rgba(36, 36, 36, 0.9);
          bottom: -4px;
        `;
      } else {
        return css`
          border-bottom: 4px solid rgba(36, 36, 36, 0.9);
          top: -4px;
        `;
      }
    }}

    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
  }
`;

export default React.memo(Tooltip);
