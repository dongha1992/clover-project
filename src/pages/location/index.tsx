import React from 'react';
import styled from 'styled-components';
import Header from '@components/Header';
import TextInput from '@components/TextInput';
import { HomeContainer } from '@styles/theme';
import { TextH6B, TextH5B, TextB2R } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';

/* TODO: 검색 결과 리스트 */

function location() {
  const router = useRouter();

  const clickSetCurrentLoc = (): void => {};
  const goToMapScreen = (): void => {
    router.push('/location/address-detaill');
  };

  return (
    <HomeContainer>
      <Header title={'내 위치 설정하기'} />
      <Wrapper>
        <TextInput
          width="100%"
          height="48px"
          name="input"
          size="14px"
          style={{ minWidth: 312 }}
          padding="12px 16px"
          placeholder="도로명, 건물명 또는 지번으로 검색"
          inputType="text"
          svg="searchIcon"
        />
        <CurrentLocBtn onClick={clickSetCurrentLoc}>
          <SVGIcon name="locationBlack" />
          <TextH6B pointer padding="0 0 0 4px">
            현 위치로 설정하기
          </TextH6B>
        </CurrentLocBtn>
        <ResultList>
          <TextH5B padding="0 0 17px 0">검색 결과 15개</TextH5B>
          <TextB2R onClick={goToMapScreen}>성수동 머시기</TextB2R>
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

export default location;
