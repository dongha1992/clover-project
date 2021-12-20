import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { TextH6B } from '@components/Text';
import dynamic from 'next/dynamic';
import { FlexCol, FlexEnd, homePadding } from '@styles/theme';
import OrderDeliveryItem from '@components/Mypage/OrderDeliveryItem';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import BorderLine from '@components/BorderLine';

const OrderDateFilter = dynamic(
  () => import('@components/Filter/OrderDateFilter')
);

function orderDeliveryHistory() {
  const [itemList, setItemList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getItemList();
  }, []);

  const clickFilterHandler = () => {
    dispatch(
      setBottomSheet({
        content: <OrderDateFilter />,
        buttonTitle: '적용하기',
      })
    );
  };

  const getItemList = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
  };

  return (
    <Container>
      <Wrapper>
        <FlexEnd onClick={clickFilterHandler} padding="16px 0">
          <SVGIcon name="filter" />
          <TextH6B padding="0 0 0 4px">정렬</TextH6B>
        </FlexEnd>
        <FlexCol>
          {itemList.map((menu, index) => (
            <FlexCol key={index}>
              <OrderDeliveryItem menu={menu} />
              {itemList.length - 1 !== index && (
                <BorderLine height={1} margin="24px 0" />
              )}
            </FlexCol>
          ))}
        </FlexCol>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

export default orderDeliveryHistory;
