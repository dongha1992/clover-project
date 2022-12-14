import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH6B } from '@components/Shared/Text';
import { IAccessMethod } from '@model/index';
type TProps = {
  option: any;
  selectOptionHandler: (option: IAccessMethod) => void;
};

const AcessMethodOption = ({ option, selectOptionHandler }: TProps) => {
  return (
    <OptionList onClick={() => selectOptionHandler(option)}>
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
  z-index: 10;

  :hover {
    background-color: #d9d9d9;
  }
`;
