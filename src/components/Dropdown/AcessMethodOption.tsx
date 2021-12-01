import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH6B } from '@components/Text';

type TProps = {
  option: any;
  selectOptionHandler: any;
};

function AcessMethodOption({ option, selectOptionHandler }: TProps) {
  return (
    <OptionList onClick={() => selectOptionHandler(option)}>
      <TextB3R>{option.text}</TextB3R>
    </OptionList>
  );
}

export default React.memo(AcessMethodOption);

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
