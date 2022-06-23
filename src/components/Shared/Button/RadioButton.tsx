import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';

export interface IRadioProps {
  onChange: React.MouseEventHandler<HTMLElement>;
  isSelected?: boolean;
  margin?: string;
}

const defaultProps = {
  name: 'color',
};

const RadioButton = ({ isSelected, onChange, margin }: IRadioProps) => {
  return (
    <RadioContainer onClick={onChange} style={{ margin: margin }}>
      <RadioLabel>
        <SVGIcon name={isSelected ? 'checkedRoundBox' : 'uncheckedRoundBox'} />
      </RadioLabel>
    </RadioContainer>
  );
};

RadioButton.defaultProps = defaultProps;

const RadioContainer = styled.div`
  display: flex;
  align-items: center;

  * {
    cursor: pointer;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputRadio = styled.input<IRadioProps>`
  display: none;
`;

export default RadioButton;
