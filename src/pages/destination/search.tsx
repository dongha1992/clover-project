import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextH6B } from '@components/Shared/Text';
import { useDispatch } from 'react-redux';
import SVGIcon from '@utils/SVGIcon';
import RecentDelivery from '@components/Pages/Destination/RecentDelivery';
import { ADDRESS_KEYWORD_REGX, SPECIAL_REGX } from '@constants/regex';
import { searchAddressJuso } from '@api/search';
import { IJuso } from '@model/index';
import DestinationSearchResult from '@components/Pages/Destination/DestinationSearchResult';
import router from 'next/router';
import { SET_DESTINATION_TEMP } from '@store/destination';

const recentDeliveryList = [
  {
    id: 1,
    name: '집',
    address: '서울 성동구 왕십리로 115 10층',
  },
  {
    id: 2,
    name: '집2',
    address: '서울 성동구 왕십리로 115 10층',
  },
];

const DestinationSearchPage = () => {
  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');

  const addressRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const getSearchAddressResult = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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

  const clickSetCurrentLoc = () => {};

  const goToDestinationDetail = (address: any) => {
    dispatch(SET_DESTINATION_TEMP(address));
    localStorage.setItem('loc', JSON.stringify(address));
    router.push('/destination/destination-detail');
  };

  const beforeSearch = resultAddress && !resultAddress.length;

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
          <TextH6B pointer padding="0 0 0 4px" onClick={clickSetCurrentLoc}>
            현 위치로 설정하기
          </TextH6B>
        </CurrentLocBtn>
        {beforeSearch ? (
          <RecentDelivery recentDeliveryList={recentDeliveryList} />
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
