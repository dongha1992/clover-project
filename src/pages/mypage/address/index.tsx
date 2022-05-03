import React, { useState } from 'react';
import styled from 'styled-components';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/common/getMediaQuery';
import { PickupItem } from '@components/Pages/Mypage/Address';
import router from 'next/router';
import { DeliveryItem } from '@components/Pages/Mypage/Address';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { FixedTab } from '@styles/theme';
import { useQuery } from 'react-query';
import { getCartsApi } from '@api/cart';

const TAB_LIST = [
  { id: 1, text: '픽업', value: 'pickup', link: '/pickup' },
  { id: 2, text: '배송', value: 'delivery', link: '/delivery' },
];

const AddressManagementPage = () => {
  const [selectedTab, setSelectedTab] = useState('/pickup');

  const { data: filteredList, isLoading } = useQuery<IDestinationsResponse[]>(
    ['getDestinationList', selectedTab],
    async () => {
      const isSpot = selectedTab === '/pickup';

      const params = {
        page: 1,
        size: 100,
        delivery: isSpot ? 'SPOT' : null,
        deliveries: !isSpot ? ['MORNING', 'QUICK', 'PARCEL'].join(',') : null,
      };
      const { data } = await getDestinationsApi(params);
      return data.data.destinations;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: cartList, isError } = useQuery(
    'getCartList',
    async () => {
      const { data } = await getCartsApi();
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      onSuccess: (data) => {},
    }
  );

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  const goToCart = () => {
    // const hasCartItem = cartList.
  };

  const goToEdit = (id: number) => {
    router.push(`/mypage/address/edit/${id}`);
  };

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <FixedTab>
        <TabList tabList={TAB_LIST} onClick={selectTabHandler} selectedTab={selectedTab} />
      </FixedTab>
      <Wrapper>
        {selectedTab === '/pickup'
          ? filteredList?.map((item: any, index: number) => (
              <PickupItem key={index} item={item} goToCart={goToCart} goToEdit={goToEdit} />
            ))
          : filteredList?.map((item: IDestinationsResponse, index: number) => (
              <DeliveryItem key={index} item={item} goToCart={goToCart} goToEdit={goToEdit} />
            ))}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 74px 0 24px 0px;
`;

export default AddressManagementPage;
