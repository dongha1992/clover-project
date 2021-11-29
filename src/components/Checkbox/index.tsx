import React from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled, { css } from 'styled-components';
import { TextH5B, TextB2R } from '@components/Text';

type TProps = {
  isSelected: boolean;
  onChange: React.MouseEventHandler<HTMLElement>;
};

function Checkbox({ isSelected, onChange }: TProps) {
  return (
    <CheckboxContainer onClick={onChange}>
      <SVGIcon name={isSelected ? 'checkedRectBox' : 'uncheckedRectBox'} />
    </CheckboxContainer>
  );
}

export default React.memo(Checkbox);

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
