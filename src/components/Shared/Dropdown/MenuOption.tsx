import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexRow, theme } from '@styles/theme';

type TProps = {
  // children: ReactNode | ReactNode[];
  // value: string;
  option: any;
  selectMenuHandler: any;
};

function MenuOption({ option, selectMenuHandler }: TProps) {
  return (
    <OptionList onClick={() => selectMenuHandler(option)}>
      <FlexBetween padding="0 0 4px 0">
        <TextB3R>{option.name}</TextB3R>
        <TextH7B>매일 60개 한정 판매</TextH7B>
      </FlexBetween>
      <FlexRow>
        <TextH6B color={theme.brandColor}>{option.discount}%</TextH6B>
        <TextH6B padding="0 4px">{option.price}원</TextH6B>
        <TextH6B color={theme.greyScale65} textDecoration="line-through">
          {option.price}원
        </TextH6B>
      </FlexRow>
    </OptionList>
  );
}

export default React.memo(MenuOption);

const OptionList = styled.li`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e4e4;
  background-color: white;
  cursor: pointer;
  z-index: 10000;

  :hover {
    background-color: #d9d9d9;
  }
`;
