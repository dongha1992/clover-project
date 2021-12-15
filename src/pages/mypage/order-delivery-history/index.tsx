import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { TextH6B } from '@components/Text';
import dynamic from 'next/dynamic';
import { FlexCol, FlexEnd, homePadding } from '@styles/theme';

const OrderDateFilter = dynamic(
  () => import('@components/Filter/OrderDateFilter')
);

function orderDeliveryHistory() {
  const dispatch = useDispatch();

  const clickFilterHandler = () => {
    dispatch(
      setBottomSheet({
        content: <OrderDateFilter />,
        buttonTitle: '적용하기',
      })
    );
  };
  return (
    <Container>
      <Wrapper>
        <FlexEnd onClick={clickFilterHandler} padding="16px 0">
          <SVGIcon name="filter" />
          <TextH6B padding="0 0 0 4px">정렬</TextH6B>
        </FlexEnd>
        <FlexCol></FlexCol>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

export default orderDeliveryHistory;
