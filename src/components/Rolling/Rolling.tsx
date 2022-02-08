import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { useInterval } from '@hooks/useInterval';

const Rolling = ({ list }: any) => {
  const [currentRollingIndex, setCurrentRollingIndex] = useState(0);

  const rollingMoveHandler = () => {
    const rollingDataLen = list.length;
    if (currentRollingIndex >= rollingDataLen - 1) {
      setCurrentRollingIndex(0);
    } else {
      setCurrentRollingIndex((prev) => prev + 1);
    }
  };

  useInterval(rollingMoveHandler, 3000);

  return (
    <RollingWrapper>
      <RollingBox>
        {list.map((item: any, index: number) => {
          const isTarget = currentRollingIndex === index;
          const previousIndex =
            currentRollingIndex - 1 >= 0
              ? currentRollingIndex - 1
              : list.length - 1;
          const isRolled = previousIndex === index;
          return (
            <TextWrapper key={index} isTarget={isTarget} isRolled={isRolled}>
              <TextH5B padding="0 4px 0 0">{item.type}</TextH5B>
              <TextB2R>{item.description}</TextB2R>
            </TextWrapper>
          );
        })}
      </RollingBox>
    </RollingWrapper>
  );
};

const RollingWrapper = styled.div`
  height: 25px;
  width: 100%;
`;

const RollingBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const TextWrapper = styled.li<{ isTarget?: boolean; isRolled?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  transition: 0.5s;
  transition: top 0.75s;
  top: 100%;
  z-index: 1;
  background-color: #ffffff;

  ${({ isTarget, isRolled }) => {
    if (isTarget) {
      return css`
        top: 0;
        z-index: 100;
      `;
    } else if (isRolled) {
      return css`
        top: -100%;
        z-index: 10;
      `;
    }
  }}
`;

export default Rolling;
