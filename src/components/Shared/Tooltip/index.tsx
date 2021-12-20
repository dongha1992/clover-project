import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';

/*TODO: 확장성 고려해서 리팩토링 */

interface ITooltip {
  message: string;
}

const Tooltip = ({ message }: ITooltip): JSX.Element | null => {
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
    <TooltipContainer>
      <TextContainer>
        <TextH5B color={theme.white} padding="0 0 2px 0">
          {message}
        </TextH5B>
        <div onClick={hideToolTip} className="svg">
          <SVGIcon name="whiteCancel" />
        </div>
      </TextContainer>
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  display: flex;
  position: absolute;
  top: 25px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 37px;
  text-align: center;
  padding: 13px 16px;
  background: rgba(36, 36, 36, 0.9);
  border-radius: 8px;
  z-index: 10;
  width: 100%;
  ${({ theme }) => theme.desktop`
    left: 0px;
  `};

  ${({ theme }) => theme.mobile`
    left: 0px;
  `};
`;

const TextContainer = styled.div`
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .svg {
    padding-left: 12px;
  }
`;

export default React.memo(Tooltip);
