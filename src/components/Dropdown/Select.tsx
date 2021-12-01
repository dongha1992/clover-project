import React, { ReactNode, useState, useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { dropdownSelector } from '../../store/dropdown';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { theme } from '@styles/theme';
import { TextB2R } from '@components/Text';

type TProps = {
  children: ReactNode | ReactNode[];
  defaultValue?: string;
  placeholder?: string;
  type?: string;
};

/* TODO: 드랍다운 absolute 말고 height 차지해야함 */

function Select({ children, defaultValue, placeholder, type }: TProps) {
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);

  const selectPlaceholder = placeholder || '디폴트 플레이스 홀더입니다.';

  const showDropdownHandler = (): void => {
    setIsShowDropdown(!isShowDropdown);
  };

  const clickOutsideHandler = (): void => {
    setIsShowDropdown(false);
  };

  useClickOutside(selectContainerRef, clickOutsideHandler);

  return (
    <SelectContainer ref={selectContainerRef}>
      <TextB2R
        className="SelectedText"
        onClick={showDropdownHandler}
        color={theme.greyScale45}
      >
        {selectPlaceholder}
      </TextB2R>
      <OptionContainer
        isShowDropdown={isShowDropdown}
        onClick={showDropdownHandler}
      >
        {children}
      </OptionContainer>
    </SelectContainer>
  );
}

const SelectContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 100%;
  height: auto;
  background-color: ${theme.white};
  border-radius: 8px;
  border: 1px solid ${theme.greyScale15};

  .SelectedText {
    padding: 10px 20px;
    cursor: pointer;
    :after {
      content: '';
      position: absolute;
      right: 16px;
      top: 40%;
      border: 4px solid transparent;
      border-color: black transparent transparent transparent;
    }
  }
`;

const OptionContainer = styled.ul<{
  isShowDropdown: boolean;
}>`
  margin: 0;
  padding: 0;
  text-align: center;
  border-radius: 5px;

  position: absolute;
  width: 100%;
  margin-top: 5px;
  z-index: 10000;

  border: 1px solid #e4e4e4;
  ${({ isShowDropdown }) => {
    if (isShowDropdown) {
      return css`
        height: 100px;
        opacity: 1;
        visibility: visible;
        overflow: scroll;
      `;
    } else {
      return css`
        min-height: 0;
        opacity: 0;
        visibility: hidden;
      `;
    }
  }}
`;

export default React.memo(Select);
