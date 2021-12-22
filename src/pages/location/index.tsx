import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { HomeContainer } from '@styles/theme';
import { TextH6B, TextH5B, TextB2R } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import { searchAddressJuso } from '@api/search';
import { IJuso } from '@model/index';
import AddressItem from '@components/Pages/Location/addressItem';
import { SET_DESTINATION_TEMP } from '@store/destination';
import { SPECIAL_REGX } from '@constants/regex/index';
/* TODO: 검색 결과 리스트 */

const KEYWORD_REGX = [
  'or',
  'select',
  'insert',
  'delete',
  'update',
  'create',
  'drop',
  'exec',
  'union',
  'fetch',
  'declare',
  'truncate',
];

function LocationPage() {
  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');
  const addressRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const clickSetCurrentLoc = (): void => {
    const locationInfoMsg = `서울 성동구 성수동1가 
    헤이그라운드 서울숲점(으)로 
    설정되었습니다.`;
    dispatch(
      setAlert({
        alertMessage: locationInfoMsg,
        onSubmit: () => {},
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };

  const getSearchAddressResult = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      if (addressRef.current) {
        let query = addressRef.current?.value;
        if (SPECIAL_REGX.test(query) || KEYWORD_REGX.includes(query)) {
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
          console.log(data.results);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const goToMapScreen = (address: any): void => {
    console.log(address);
    dispatch(SET_DESTINATION_TEMP(address));
    router.push('/location/address-detail');
  };

  return (
    <HomeContainer>
      <Wrapper>
        <TextInput
          name="input"
          // style={{ minWidth: 312 }}
          placeholder="도로명, 건물명 또는 지번으로 검색"
          inputType="text"
          svg="searchIcon"
          keyPressHandler={getSearchAddressResult}
          ref={addressRef}
        />
        <CurrentLocBtn onClick={clickSetCurrentLoc}>
          <SVGIcon name="locationBlack" />
          <TextH6B pointer padding="0 0 0 4px">
            현 위치로 설정하기
          </TextH6B>
        </CurrentLocBtn>
        <ResultList>
          <TextH5B padding="0 0 17px 0">검색 결과 {totalCount}개</TextH5B>
          {resultAddress ? (
            resultAddress.map((address, index) => {
              return (
                <AddressItem
                  key={index}
                  roadAddr={address.roadAddr}
                  bdNm={address.bdNm}
                  jibunAddr={address.jibunAddr}
                  onClick={() => goToMapScreen(address)}
                />
              );
            })
          ) : (
            <div>검색 결과가 없습니다</div>
          )}
        </ResultList>
      </Wrapper>
    </HomeContainer>
  );
}

const Wrapper = styled.div`
  padding: 8px 0px 24px;
`;

const CurrentLocBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

const ResultList = styled.div``;

export default LocationPage;
