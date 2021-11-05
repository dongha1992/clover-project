import React from 'react';
import styled from 'styled-components';
import Header from '@components/Header';
import TextInput from '@components/TextInput';
import { defaultRightScreen } from '@styles/theme';
import { TextH6B } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';

function location() {
  const clickSetCurrentLoc = (): void => {};
  return (
    <>
      <Header title={'내 위치 설정하기'} />
      <Container>
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
      </Container>
    </>
  );
}

const Container = styled.div`
  ${defaultRightScreen}
  padding:  8px 0px 24px;
`;

const CurrentLocBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

export default location;
