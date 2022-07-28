import React, { ReactNode, useState, useRef } from 'react';
import useClickOutside from '../../../hooks/useClickOutside';
import { dropdownSelector } from '../../../store/dropdown';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { theme } from '@styles/theme';
import { TextB2R } from '@components/Shared/Text';

type TProps = {
  children: ReactNode | ReactNode[] | any;
  value?: string;
  placeholder?: string;
  type?: string;
};

const Select = ({ children, value, placeholder, type }: TProps) => {
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
  const hasChildren = children?.filter((item: any) => item).length !== 0;
  const selectPlaceholder = placeholder || '디폴트 플레이스 홀더입니다.';

  const showDropdownHandler = (): void => {
    if (!hasChildren) {
      setIsShowDropdown(false);
      return;
    }

    setIsShowDropdown(!isShowDropdown);
  };

  const clickOutsideHandler = (): void => {
    setIsShowDropdown(false);
  };

  useClickOutside(selectContainerRef, clickOutsideHandler);

  return (
    <SelectContainer ref={selectContainerRef}>
      <TextB2R className="SelectedText" onClick={showDropdownHandler} color={value ? theme.black : theme.greyScale45}>
        {value ? value : selectPlaceholder}
      </TextB2R>
      <OptionContainer isShowDropdown={isShowDropdown} onClick={showDropdownHandler}>
        {children}
      </OptionContainer>
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-height: 350px;
  background-color: ${theme.white};
  border-radius: 8px;
  border: 1px solid ${theme.greyScale15};

  .SelectedText {
    position: relative;
    padding: 12px 16px;
    cursor: pointer;
    :after {
      content: '';
      position: absolute;
      right: 16px;
      top: 50%;
      border: 4px solid transparent;
      border-color: black transparent transparent transparent;
    }
  }
`;

const OptionContainer = styled.ul<{
  isShowDropdown: boolean;
  props?: boolean;
}>`
  margin: 0;
  padding: 0;
  text-align: center;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;

  border: 1px solid #e4e4e4;

  ${({ isShowDropdown }) => {
    if (isShowDropdown) {
      return css`
        height: 110px;
        opacity: 1;
        visibility: visible;
        overflow: scroll;
      `;
    } else {
      return css`
        height: 0;
        opacity: 0;
        visibility: hidden;
      `;
    }
  }}
`;

export default React.memo(Select);
