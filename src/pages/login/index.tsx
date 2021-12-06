import React from 'react';
import styled from 'styled-components';
import TextInput from '@components/TextInput';
import {
  FlexBetween,
  FlexCenter,
  FlexCol,
  FlexRow,
  homePadding,
  theme,
} from '@styles/theme';
import { TextB2R, TextB3R } from '@components/Text';
import Checkbox from '@components/Checkbox';
import Button from '@components/Button';
import router from 'next/router';

function login() {
  const checkAutoLoginHandler = () => {};

  const goToSignup = () => {
    router.push('/signup');
  };
  const goToFindEmail = () => {
    router.push('/login/find-account/email');
  };

  const goToFindPassword = () => {
    router.push('/login/find-account/password');
  };

  return (
    <Container>
      <FlexCol padding="32px 0 0 0">
        <TextInput margin="0 0 8px 0" placeholder="이메일" />
        <TextInput placeholder="이메일" />
        <TextB3R padding="2px 0 0 16px" color={theme.systemRed}>
          ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
        </TextB3R>
      </FlexCol>
      <FlexRow padding="16px 0 24px 0">
        <Checkbox onChange={checkAutoLoginHandler} isSelected />
        <TextB2R padding="2px 0 0 8px">자동 로그인</TextB2R>
      </FlexRow>
      <BtnWrapper>
        <Button disabled>로그인하기</Button>
      </BtnWrapper>
      <FlexCenter>
        <TextB2R color={theme.greyScale75} onClick={goToSignup}>
          회원가입
        </TextB2R>
        <Col />
        <TextB2R color={theme.greyScale75} onClick={goToFindEmail}>
          아이디(이메일) 찾기
        </TextB2R>
        <Col />
        <TextB2R color={theme.greyScale75} onClick={goToFindPassword}>
          비밀번호 찾기
        </TextB2R>
      </FlexCenter>
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;

const BtnWrapper = styled.div`
  margin-bottom: 8px;
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 8px;
`;
export default login;
