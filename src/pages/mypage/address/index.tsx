import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SPOT_URL } from '@constants/mock';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/getMediaQuery';
import { PickupItem } from '@components/Pages/Mypage/Address';
import axios from 'axios';
import { ISpotItem } from '@components/Pages/Spot/SpotsSearchItem';
import router from 'next/router';
import { DeliveryItem } from '@components/Pages/Mypage/Address';
import { getDestinations } from '@api/destination';
import { IDestinationsResponse } from '@model/index';

const TAB_LIST = [
  { id: 1, text: '픽업', value: 'pickup', link: '/pickup' },
  { id: 2, text: '배송', value: 'delivery', link: '/delivery' },
];

const AddressManagementPage = () => {
  const [selectedTab, setSelectedTab] = useState('/pickup');
  const [pickupList, setpickupList] = useState([]);
  const [deliveryList, setDeliveryList] = useState<IDestinationsResponse[]>([]);
  useEffect(() => {
    if (selectedTab === '/pickup') {
      getPickupItem();
    } else {
      getDeliveryList();
    }
  }, [selectedTab]);

  const getDeliveryList = async () => {
    const params = {
      page: 1,
      size: 10,
    };
    try {
      const { data } = await getDestinations(params);
      if (data.code === 200) {
        const { destinations } = data.data;
        setDeliveryList(destinations);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  const getPickupItem = async () => {
    const { data } = await axios.get(SPOT_URL);
    setpickupList(data);
  };

  const goToCart = () => {};

  const goToEdit = (id: number) => {
    router.push(`/mypage/address/edit/${id}`);
  };

  if (deliveryList.length < 0 || pickupList.length < 0) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <FixedTab>
        <TabList
          tabList={TAB_LIST}
          onClick={selectTabHandler}
          selectedTab={selectedTab}
        />
      </FixedTab>
      <Wrapper>
        {selectedTab === '/pickup'
          ? pickupList.map((item: ISpotItem, index: number) => (
              <PickupItem
                key={index}
                item={item}
                goToCart={goToCart}
                goToEdit={goToEdit}
              />
            ))
          : deliveryList.map((item: IDestinationsResponse, index: number) => (
              <DeliveryItem
                key={index}
                item={item}
                goToCart={goToCart}
                goToEdit={goToEdit}
              />
            ))}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;
const FixedTab = styled.div`
  position: fixed;
  width: 100%;
  left: calc(50%);
  right: 0;
  background-color: white;
  max-width: ${breakpoints.mobile}px;
  width: 100%;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;
const Wrapper = styled.div`
  padding: 74px 0 24px 0px;
`;

export default AddressManagementPage;
