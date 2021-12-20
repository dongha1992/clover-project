import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH6B } from '@components/Shared/Text';

type TProps = {
  // children: ReactNode | ReactNode[];
  // value: string;
  option: any;
  selectMenuHandler: any;
};

function MenuOption({ option, selectMenuHandler }: TProps) {
  return (
    <OptionList onClick={() => selectMenuHandler(option)}>
      <TextB3R>{option.text}</TextB3R>
      <TextH6B padding="0 0 0 2px">{option.price}원</TextH6B>
    </OptionList>
  );
}

export default React.memo(MenuOption);

const OptionList = styled.li`
  display: flex;
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
