import React, { useState } from 'react';
import { OrderFilter } from '@components/Filter/components';
import { TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { ORDER_DATE_RADIO_CHECKBOX } from '@constants/filter';
import { theme } from '@styles/theme';

const OrderDateFilter = () => {
  const [selectedRadioId, setSelectedRadioId] = useState(1);

  const radioButtonHandler = (id: number) => {
    setSelectedRadioId(id);
  };

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        정렬
      </TextH5B>
      <Wrapper>
        <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
          정렬
        </TextH5B>
        <OrderFilter
          data={ORDER_DATE_RADIO_CHECKBOX}
          changeHandler={radioButtonHandler}
          selectedRadioId={selectedRadioId}
        />
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 32px;
`;
const Wrapper = styled.div`
  padding-left: 24px;
`;

export default React.memo(OrderDateFilter);