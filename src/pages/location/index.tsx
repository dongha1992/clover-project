import React from 'react';
import styled from 'styled-components';
import Header from '@components/Header';
import TextInput from '@components/TextInput';
import { HomeContainer } from '@styles/theme';
import { TextH6B, TextH5B, TextB2R } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
/* TODO: 검색 결과 리스트 */

function location() {
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

  const goToMapScreen = (): void => {
    router.push('/location/address-detail');
  };

  return (
    <HomeContainer>
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
