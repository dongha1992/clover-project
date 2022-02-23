import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { TextH6B } from '@components/Shared/Text';
import dynamic from 'next/dynamic';
import { FlexCol, FlexEnd, homePadding } from '@styles/theme';
import OrderDeliveryItem from '@components/Pages/Mypage/OrderDelivery/OrderDeliveryItem';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import BorderLine from '@components/Shared/BorderLine';

const OrderDateFilter = dynamic(() => import('@components/Filter/OrderDateFilter'));

const OrderDeliveryHistoryPage = () => {
  const [itemList, setItemList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getItemList();
  }, []);

  const clickFilterHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <OrderDateFilter />,
      })
    );
  };

  const getItemList = async () => {
    const { data } = await axios.get(`${BASE_URL}/itemList`);
    setItemList(data.data);
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
              {itemList.length - 1 !== index && <BorderLine height={1} margin="24px 0" />}
            </FlexCol>
          ))}
        </FlexCol>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

export default OrderDeliveryHistoryPage;
