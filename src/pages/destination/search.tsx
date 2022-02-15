import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextH6B } from '@components/Shared/Text';
import { useDispatch, useSelector } from 'react-redux';
import SVGIcon from '@utils/SVGIcon';
import { RecentDelivery } from '@components/Pages/Destination';
import { ADDRESS_KEYWORD_REGX, SPECIAL_REGX } from '@constants/regex';
import { searchAddressJuso } from '@api/search';
import { IJuso } from '@model/index';
import { DestinationSearchResult } from '@components/Pages/Destination';
import router from 'next/router';
import { destinationForm, SET_LOCATION_TEMP } from '@store/destination';
import { getDestinations } from '@api/destination';
import { useQuery } from 'react-query';
import { IDestinationsResponse } from '@model/index';

const DestinationSearchPage = () => {
  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');

  const addressRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { userDestinationStatus } = useSelector(destinationForm);

  const { data: filteredList, isLoading } = useQuery<IDestinationsResponse[]>(
    'getDestinationList',
    async () => {
      const params = {
        page: 1,
        size: 10,
      };
      const { data } = await getDestinations(params);
      const totalList = data.data.destinations;
      return totalList.filter((item) => {
        return item.delivery === userDestinationStatus.toUpperCase();
      });
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  console.log(filteredList, 'filteredList');

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
    console.log(destination, 'destination');
  };

  const goToDestinationDetail = (address: any) => {
    dispatch(SET_LOCATION_TEMP(address));
    router.push('/destination/destination-detail');
  };

  const beforeSearch = resultAddress && !resultAddress.length;

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
        <CurrentLocBtn>
          <SVGIcon name="locationBlack" />
          <TextH6B pointer padding="0 0 0 4px">
            현 위치로 설정하기
          </TextH6B>
        </CurrentLocBtn>
        {beforeSearch ? (
          <RecentDelivery filteredList={filteredList ?? []} onClick={selectDestinationByList} />
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
`;

const CurrentLocBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

export default DestinationSearchPage;
