import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';

export interface IRadioProps {
  id?: string;
  className?: string;
  name?: string;
  value?: string;
  hideValue?: boolean;
  status?: boolean;
  item?: any;
  onChange?: React.ChangeEventHandler<HTMLElement>;
}

const defaultProps = {
  name: 'color',
};

export const RadioButton = ({
  id,
  className,
  name,
  item,
  hideValue,
  status,
  onChange,
}: IRadioProps) => {
  return (
    <RadioContainer>
      <RadioLabel>
        <InputRadio
          type="radio"
          id={item.value}
          className={className}
          onChange={onChange}
        />
        <IconRadio id={item.value}>
          {item.isChecked ? (
            <SVGIcon name="checkedRoundBox" />
          ) : (
            <SVGIcon name="uncheckedRoundBox" />
          )}
        </IconRadio>
        <ValueRadio hideValue={hideValue}>
          {item.isChecked ? (
            <TextH5B>{item.text}</TextH5B>
          ) : (
            <TextB2R>{item.text}</TextB2R>
          )}
        </ValueRadio>
      </RadioLabel>
    </RadioContainer>
  );
};

RadioButton.defaultProps = defaultProps;

const RadioContainer = styled.div<IRadioProps>`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  * {
    cursor: pointer;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconRadio = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const InputRadio = styled.input<IRadioProps>`
  display: none;
`;

const ValueRadio = styled.div<IRadioProps>`
  display: ${(props) => (props.hideValue ? 'none' : 'block')};
`;
