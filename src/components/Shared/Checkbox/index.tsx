import React from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled, { css } from 'styled-components';

type TProps = {
  isSelected: boolean;
  id?: string;
  onChange: React.MouseEventHandler<HTMLElement>;
};

const Checkbox = ({ isSelected, onChange, id }: TProps) => {
  return (
    <CheckboxContainer onClick={onChange} id={id}>
      <SVGIcon name={isSelected ? 'checkedRectBox' : 'uncheckedRectBox'} />
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
