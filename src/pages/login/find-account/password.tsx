import React from 'react';
import styled from 'styled-components';
import TextInput from '@components/TextInput';
import { TextB2R } from '@components/Text';
import { fixedBottom } from '@styles/theme';
import Button from '@components/Button';

function findPassword() {
  return (
    <Container>
      <TextB2R>아이디와 등록된 휴대폰 번호를 입력해 주시면 </TextB2R>
      <TextB2R>문자로 임시 비밀번호를 보내드립니다.</TextB2R>
      <InputWrapper>
        <TextInput />
        <TextInput margin="8px 0 0 0" />
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
export default findPassword;
