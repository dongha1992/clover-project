import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextH6B } from '@components/Shared/Text';
import { useDispatch, useSelector } from 'react-redux';
import { SVGIcon } from '@utils/common/';
import { RecentDelivery } from '@components/Pages/Destination';
import { ADDRESS_KEYWORD_REGX, SPECIAL_REGX } from '@constants/regex';
import { searchAddressJuso } from '@api/search';
import { IJuso } from '@model/index';
import { DestinationSearchResult } from '@components/Pages/Destination';
import router from 'next/router';
import { destinationForm, SET_LOCATION_TEMP, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_DESTINATION } from '@store/mypage';
import { getDestinationsApi } from '@api/destination';
import { useQuery } from 'react-query';
import { IDestinationsResponse } from '@model/index';
import { DELIVERY_TYPE_MAP } from '@constants/order';

const DestinationSearchPage = () => {
  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');

  const addressRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { userDeliveryType } = useSelector(destinationForm);

  const { orderId, isSubscription, destinationId, subsDeliveryType, menuId } = router.query;

  const { data: filteredList, isLoading } = useQuery<IDestinationsResponse[]>(
    'getDestinationList',
    async () => {
      const params = {
        page: 1,
        size: 10,
        delivery: userDeliveryType.toUpperCase(),
      };
      const { data } = await getDestinationsApi(params);

      return data.data.destinations;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const getSearchAddressResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (addressRef.current) {
        let query = addressRef.current?.value;
        if (SPECIAL_REGX.test(query) || ADDRESS_KEYWORD_REGX.includes(query)) {
          alert('포함할 수 없는 문자입니다.');
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
        query: { orderId, destinationId: destination.id },
      });
      dispatch(SET_TEMP_EDIT_DESTINATION(destination));
    } else {
      dispatch(SET_TEMP_DESTINATION(destination));
      if (isSubscription) {
        router.push({
          pathname: '/cart/delivery-info',
          query: { subsDeliveryType, isSubscription: true, destinationId: destination.id, menuId },
        });
      } else {
        router.push({ pathname: '/cart/delivery-info', query: { destinationId: destination.id } });
      }
    }
  };

  const goToDestinationDetail = (address: any) => {
    if (orderId) {
      dispatch(SET_LOCATION_TEMP(address));
      router.push({ pathname: '/destination/destination-detail', query: { orderId, destinationId } });
    } else {
      dispatch(SET_LOCATION_TEMP(address));
      if (isSubscription) {
        router.push({
          pathname: '/destination/destination-detail',
          query: { subsDeliveryType, isSubscription: true, menuId },
        });
      } else {
        router.push('/destination/destination-detail');
      }
    }
  };

  const beforeSearch = resultAddress && !resultAddress.length;

  useEffect(() => {
    if (!userDeliveryType) {
      router.replace('/cart');
    }
  }, []);

  if (beforeSearch && isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        <TextWrapper>
          <TextInput
            placeholder="도로명, 건물명 또는 지번으로 검색"
            svg="searchIcon"
            keyPressHandler={getSearchAddressResult}
            ref={addressRef}
          />
        </TextWrapper>
        {beforeSearch ? (
          <RecentDelivery
            filteredList={filteredList ?? []}
            onClick={selectDestinationByList}
            delivery={DELIVERY_TYPE_MAP[userDeliveryType.toUpperCase()]}
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

const CurrentLocBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

export default DestinationSearchPage;
