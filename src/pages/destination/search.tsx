import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { useDispatch } from 'react-redux';
import { RecentDelivery } from '@components/Pages/Destination';
import { ADDRESS_KEYWORD_REGX, SPECIAL_REGX } from '@constants/regex';
import { searchAddressJuso } from '@api/search';
import { IJuso } from '@model/index';
import { DestinationSearchResult } from '@components/Pages/Destination';
import router from 'next/router';
import { SET_LOCATION_TEMP, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_DESTINATION } from '@store/mypage';
import { getDestinationsApi } from '@api/destination';
import { useQuery } from 'react-query';
import { IDestinationsResponse } from '@model/index';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { show, hide } from '@store/loading';

const DestinationSearchPage = () => {
  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');
  const [selectDeliveryType, setSelectDeliveryType] = useState<string>('');

  const addressRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const { orderId, isSubscription, destinationId, subsDeliveryType, menuId, deliveryType } = router.query;
  const isSubs = isSubscription === 'true';

  const { data: filteredList, isLoading } = useQuery<IDestinationsResponse[]>(
    ['getDestinationList', selectDeliveryType],
    async () => {
      dispatch(show());
      const params = {
        page: 1,
        size: 10,
        delivery: selectDeliveryType! as string,
      };
      const { data } = await getDestinationsApi(params);

      return data.data.destinations;
    },
    {
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const getSearchAddressResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (addressRef.current) {
        let query = addressRef.current?.value;
        if (SPECIAL_REGX.test(query) || ADDRESS_KEYWORD_REGX.includes(query)) {
          alert('????????? ??? ?????? ???????????????.');
          return;
        }

        const params = {
          query,
          page: 1,
        };

        try {
          let { data } = await searchAddressJuso(params);
          setResultAddress(data.results.juso);
          setTotalCount(data.results.common.totalCount);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const selectDestinationByList = (destination: IDestinationsResponse): void => {
    if (orderId) {
      router.push({
        pathname: '/mypage/order-detail/edit/[orderId]',
        query: { orderId, destinationId: isSubs ? destinationId : destination.id, isSubscription: isSubs },
      });
      dispatch(SET_TEMP_EDIT_DESTINATION(destination));
    } else {
      dispatch(SET_TEMP_DESTINATION(destination));
      if (isSubs) {
        router.replace({
          pathname: '/cart/delivery-info',
          query: { subsDeliveryType, isSubscription: isSubs, destinationId: destination.id, menuId },
        });
      } else {
        router.replace({
          pathname: '/cart/delivery-info',
          query: { destinationId: destination.id, deliveryType: selectDeliveryType },
        });
      }
    }
  };

  const goToDestinationDetail = (address: any) => {
    if (orderId) {
      dispatch(SET_LOCATION_TEMP(address));
      router.push({
        pathname: '/destination/destination-detail',
        query: { orderId, destinationId, deliveryType: selectDeliveryType },
      });
    } else {
      dispatch(SET_LOCATION_TEMP(address));
      if (isSubscription) {
        router.replace({
          pathname: '/destination/destination-detail',
          query: { subsDeliveryType, isSubscription: isSubs, menuId },
        });
      } else {
        router.replace({
          pathname: '/destination/destination-detail',
          query: {
            deliveryType: selectDeliveryType,
          },
        });
      }
    }
  };

  const beforeSearch = resultAddress && !resultAddress.length;

  useEffect(() => {
    if (router.isReady) {
      setSelectDeliveryType((deliveryType as string) ?? (subsDeliveryType as string));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (isSubs) {
      // if (!subsDeliveryType) {

      //   router.replace('/subscription');
      // }
      return;
    } else {
      if (!deliveryType) router.replace('/cart');
    }
  }, []);

  if (beforeSearch && isLoading) {
    return <div></div>;
  }

  return (
    <Container>
      <Wrapper>
        <TextWrapper>
          <TextInput
            placeholder="?????????, ????????? ?????? ???????????? ??????"
            svg="searchIcon"
            keyPressHandler={getSearchAddressResult}
            ref={addressRef}
          />
        </TextWrapper>
        {beforeSearch ? (
          <RecentDelivery
            filteredList={filteredList ?? []}
            onClick={selectDestinationByList}
            delivery={DELIVERY_TYPE_MAP[selectDeliveryType as string]}
          />
        ) : (
          <DestinationSearchResult
            resultAddress={resultAddress}
            onClick={goToDestinationDetail}
            totalCount={totalCount}
          />
        )}
      </Wrapper>
    </Container>
  );
};

const Container = styled.main``;

const Wrapper = styled.div`
  padding: 8px 24px;
`;

const TextWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

export default DestinationSearchPage;

// ???????????? ??? query ???????????? ?????? ??????
// https://stackoverflow.com/questions/61891845/is-there-a-way-to-keep-router-query-on-page-refresh-in-nextjs

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}
