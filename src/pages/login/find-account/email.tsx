import React from 'react';
import styled from 'styled-components';
import TextInput from '@components/TextInput';
import { TextB2R, TextB3R } from '@components/Text';
import Button from '@components/Button';
import { fixedBottom, theme } from '@styles/theme';

function findEmail() {
  return (
    <Container>
      <TextB2R>등록된 휴대폰 번호를 입력해 주시면</TextB2R>
      <TextB2R>해당 번호로 이메일 주소를 보내드립니다.</TextB2R>
      <InputWrapper>
        <TextInput />
        <TextInput margin="8px 0 0 0" />
        <TextB3R padding="2px 0 0 16px" color={theme.systemRed}>
          ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
        </TextB3R>
      </InputWrapper>
      <BtnWrapper>
        <Button>요청하기</Button>
      </BtnWrapper>
    </Container>
  );
}

const Container = styled.div`
  padding: 84px 24px;
`;

const InputWrapper = styled.div`
  margin-top: 28px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;

export default findEmail;
