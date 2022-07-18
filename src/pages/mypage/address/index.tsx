import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/common/getMediaQuery';
import { PickupItem } from '@components/Pages/Mypage/Address';
import router from 'next/router';
import { DeliveryItem } from '@components/Pages/Mypage/Address';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { fixedTab } from '@styles/theme';
import { useQuery } from 'react-query';
import { getCartsApi } from '@api/cart';
import { useDispatch } from 'react-redux';
import { SET_DESTINATION, SET_USER_DELIVERY_TYPE } from '@store/destination';
import { commonSelector } from '@store/common';
import { useSelector } from 'react-redux';
import useScrollCheck from '@hooks/useScrollCheck';

const TAB_LIST = [
  { id: 1, text: '픽업', value: 'pickup', link: '/pickup' },
  { id: 2, text: '배송', value: 'delivery', link: '/delivery' },
];

const AddressManagementPage = () => {
  const [selectedTab, setSelectedTab] = useState('/pickup');
  // const { isScroll } = useSelector(commonSelector);
  const isScroll = useScrollCheck();

  const dispatch = useDispatch();

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

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  const goToCart = (item: IDestinationsResponse) => {
    dispatch(SET_DESTINATION({ ...item, closedDate: item.spotPickup?.spot.closedDate }));
    dispatch(SET_USER_DELIVERY_TYPE(item?.delivery?.toLowerCase()!));
    router.push('/cart');
  };

  const goToEdit = (id: number) => {
    router.push(`/mypage/address/edit/${id}`);
  };

  const goToSpotEdit = ({ id, spotPickupId }: { id: number; spotPickupId: number }) => {
    router.push({ pathname: `/mypage/address/edit/${id}`, query: { spotPickupId } });
  };

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <FixedTab scroll={isScroll}>
        <TabList tabList={TAB_LIST} onClick={selectTabHandler} selectedTab={selectedTab} />
      </FixedTab>
      <Wrapper>
        {selectedTab === '/pickup'
          ? filteredList?.map((item: any, index: number) => (
              <PickupItem key={index} item={item} goToCart={goToCart} goToEdit={goToSpotEdit} />
            ))
          : filteredList?.map((item: IDestinationsResponse, index: number) => (
              <DeliveryItem key={index} item={item} goToCart={goToCart} goToEdit={goToEdit} />
            ))}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;

const FixedTab = styled.div<{ scroll: boolean }>`
  ${fixedTab};

  ${({ scroll }) => {
    if (scroll) {
      return css`
        box-shadow: -1px 9px 16px -4px rgb(0 0 0 / 25%);
      `;
    }
  }}
`;

const Wrapper = styled.div`
  padding: 74px 0 24px 0px;
`;

export default AddressManagementPage;
