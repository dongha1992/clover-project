import React from 'react';
import { TextH5B } from '@components/Text';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { RadioButton } from '@components/Button/RadioButton';

type TProps = {
  title: string;
  data: any;
  changeHandler: React.ChangeEventHandler<HTMLElement>;
};

function OrderFilter({ title, data, changeHandler }: TProps) {
  return (
    <Container>
      <TextH5B padding="0 0 8px 0" color={theme.greyScale65}>
        {title}
      </TextH5B>
      <BtnContainer>
        {data &&
          data.map((item: any, index: number) => (
            <RadioButton item={item} onChange={changeHandler} key={index} />
          ))}
      </BtnContainer>
    </Container>
  );
}

const Container = styled.div``;
const BtnContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

export default OrderFilter;
