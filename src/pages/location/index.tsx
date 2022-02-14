import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { HomeContainer } from '@styles/theme';
import { TextH6B, TextH5B, TextB2R } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import { searchAddressJuso } from '@api/search';
import { getAddressFromLonLat } from '@api/location';
import { IJuso } from '@model/index';
import AddressItem from '@components/Pages/Location/AddressItem';
import { SET_LOCATION_TEMP } from '@store/destination';
import { SPECIAL_REGX, ADDRESS_KEYWORD_REGX } from '@constants/regex/index';

const LocationPage = () => {
  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');
  const [isFocus, setIsFocus] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isSpot } = router.query;

  const getGeoLocation = () => {};

  const addressInputHandler = () => {
    const keyword = addressRef.current?.value.length;
    setIsTyping(true);
    if (addressRef.current) {
      if (!keyword) {
        setResultAddress([]);
        setIsSearched(false);
        clearInputHandler();
      }
    }
  };

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
          /* data.results.juso 검색결과 없으면 null */
          let { data } = await searchAddressJuso(params);
          setResultAddress(data.results.juso ?? []);
          setTotalCount(data.results.common.totalCount);
          setIsSearched(true);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const focusInputHandler = () => {
    setIsFocus(true);
  };

  const blurInputHandler = () => {
    setIsFocus(false);
  };

  const clearInputHandler = () => {
    if (addressRef.current) {
      addressRef.current.value = '';
    }
    setIsTyping(false);
  };

  const goToMapScreen = (address: any): void => {
    dispatch(SET_LOCATION_TEMP(address));
    if (isSpot) {
      router.push({
        pathname: '/location/address-detail',
        query: { isSpot: true },
      });
    } else {
      router.push({
        pathname: '/location/address-detail',
        query: { isLocation: true },
      });
    }
  };

  return (
    <HomeContainer>
      <Wrapper>
        <TextInput
          name="input"
          placeholder="도로명, 건물명 또는 지번으로 검색"
          inputType="text"
          svg="searchIcon"
          eventHandler={addressInputHandler}
          keyPressHandler={getSearchAddressResult}
          ref={addressRef}
        />
        <CurrentLocBtn>
          <SVGIcon name="locationBlack" />
          <TextH6B pointer padding="0 0 0 4px" onClick={getGeoLocation}>
            현 위치로 설정하기
          </TextH6B>
        </CurrentLocBtn>
        <ResultList>
          {resultAddress.length > 0 && (
            <>
              <TextH5B padding="0 0 17px 0">검색 결과 {totalCount}개</TextH5B>
              {resultAddress.map((address, index) => {
                return (
                  <AddressItem
                    key={index}
                    roadAddr={address.roadAddrPart1}
                    bdNm={address.bdNm}
                    jibunAddr={address.jibunAddr}
                    zipNo={address.zipNo}
                    onClick={() => goToMapScreen(address)}
                  />
                );
              })}
            </>
          )}
          {!resultAddress.length && isSearched && <div>검색 결과가 없습니다.</div>}
        </ResultList>
      </Wrapper>
    </HomeContainer>
  );
};

const Wrapper = styled.div`
  padding: 8px 0px 24px;
`;

const TextInputWrapper = styled.div`
  position: relative;
  .removeSvg {
    position: absolute;
    right: 5%;
    top: 32%;
  }
`;

const CurrentLocBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

const ResultList = styled.div``;

export default LocationPage;
