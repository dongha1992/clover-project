import React from 'react';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import styled from 'styled-components';
import { theme, FlexRow } from '@styles/theme';
import { RadioButton } from '@components/Shared/Button';

type TProps = {
  data: any;
  changeHandler: (value: string) => void;
  selectedRadioValue: string;
};

const OrderFilter = ({ data, changeHandler, selectedRadioValue }: TProps) => {
  return (
    <Container>
      <BtnContainer>
        {data &&
          data.map((item: any, index: number) => {
            const isSelected = selectedRadioValue === item.value;
            return (
              <FlexRow key={index}>
                <RadioButton isSelected={isSelected} onChange={() => changeHandler(item.value)} key={index} />
                {isSelected ? (
                  <TextH5B padding="0px 0 0 8px">{item.text}</TextH5B>
                ) : (
                  <TextB2R padding="0px 0 0 8px">{item.text}</TextB2R>
                )}
              </FlexRow>
            );
          })}
      </BtnContainer>
    </Container>
  );
};

const Container = styled.div``;
const BtnContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

export default OrderFilter;
