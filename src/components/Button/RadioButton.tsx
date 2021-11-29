import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';

export interface IRadioProps {
  onChange: React.MouseEventHandler<HTMLElement>;
  isSelected?: boolean;
}

const defaultProps = {
  name: 'color',
};

export const RadioButton = ({ isSelected, onChange }: IRadioProps) => {
  return (
    <RadioContainer onClick={onChange}>
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
