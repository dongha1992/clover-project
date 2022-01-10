import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH6B, TextH7B } from '@components/Shared/Text';
import {
  FlexBetween,
  FlexCol,
  FlexRow,
  FlexRowStart,
  theme,
} from '@styles/theme';

type TProps = {
  // children: ReactNode | ReactNode[];
  // value: string;
  option: any;
  selectMenuHandler: any;
};

const MenuOption = ({ option, selectMenuHandler }: TProps) => {
  return (
    <OptionList onClick={() => selectMenuHandler(option)}>
      <FlexBetween>
        <TextB3R>{option.name}</TextB3R>
        <TextH7B>매일 60개 한정 판매</TextH7B>
      </FlexBetween>
      <FlexRowStart padding="0 0 4px 0">
        <TextH7B color={theme.brandColor}>(굿바이 세일 1+1 증정)</TextH7B>
      </FlexRowStart>
      <FlexRow>
        <TextH6B color={theme.brandColor}>{option.discount}%</TextH6B>
        <TextH6B padding="0 4px">{option.price}원</TextH6B>
        <TextH6B color={theme.greyScale65} textDecoration="line-through">
          {option.price}원
        </TextH6B>
      </FlexRow>
    </OptionList>
  );
};

export default React.memo(MenuOption);

const OptionList = styled.li`
  display: flex;
  flex-direction: column;

  list-style-type: none;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e4e4;
  background-color: white;
  cursor: pointer;

  :hover {
    background-color: #d9d9d9;
  }
`;