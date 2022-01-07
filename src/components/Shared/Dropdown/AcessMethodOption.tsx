import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH6B } from '@components/Shared/Text';

type TProps = {
  option: any;
  selectOptionHandler: (text: string) => void;
};

const AcessMethodOption = ({ option, selectOptionHandler }: TProps) => {
  return (
    <OptionList onClick={() => selectOptionHandler(option.text)}>
      <TextB3R>{option.text}</TextB3R>
    </OptionList>
  );
};

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
