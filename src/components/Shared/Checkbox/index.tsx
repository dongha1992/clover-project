import React from 'react';
import { SVGIcon } from '@utils/common';
import styled, { css } from 'styled-components';

type TProps = {
  isSelected: boolean;
  id?: string;
  onChange: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
};

const Checkbox = ({ isSelected, onChange, id, disabled, className }: TProps) => {
  return (
    <CheckboxContainer onClick={onChange} id={id} className={className}>
      {!disabled ? (
        <SVGIcon name={isSelected ? 'checkedRectBox' : 'uncheckedRectBox'} />
      ) : (
        <SVGIcon name={'uncheckedRectBox'} />
      )}
    </CheckboxContainer>
  );
};

export default React.memo(Checkbox);

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;
