import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextB2R, TextB3R } from '@components/Shared/Text';
import { fixedBottom, theme } from '@styles/theme';
import Validation from '@components/Pages/User/Validation';
import { PHONE_REGX, NAME_REGX } from '@pages/signup/auth';
import dynamic from 'next/dynamic';
import { userHelpEmail } from '@api/user';

const Button = dynamic(() => import('../../../components/Shared/Button/Button'), {
  ssr: false,
});

const FindEmailPage = () => {
  const [phoneValid, setPhoneValid] = useState({
    message: '',
    isValid: false,
  });
  const [nameValid, setNameValid] = useState({
    message: '',
    isValid: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {}, [nameRef, phoneRef]);

  const nameInputHandler = () => {
    if (nameRef.current) {
      const name = nameRef.current?.value;

      const nameValidCheck = NAME_REGX.test(name);

      if (nameValidCheck) {
        setNameValid({ ...nameValid, isValid: true });
      } else {
        setNameValid({ ...nameValid, isValid: false });
      }
    }
  };

  const phoneInputHandler = () => {
    if (phoneRef.current) {
      const phone = phoneRef.current?.value.toString();

      const phoneValidCheck = PHONE_REGX.test(phone);

      if (phoneValidCheck) {
        setPhoneValid({ ...phoneValid, isValid: true });
      } else {
        setPhoneValid({ ...phoneValid, isValid: false });
      }
    }
  };

  const getHelpEmail = async () => {
    if (phoneRef.current && nameRef.current) {
      const name = nameRef.current?.value;
      const tel = phoneRef.current?.value.toString();

      try {
        const { data } = await userHelpEmail({ name, tel });

        if (data.code === 200) {
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('입력하신 정보로 일치하는 계정이 없습니다.');
      }
    }
  };

  const isAllValid = nameValid.isValid && phoneValid.isValid;

  return (
    <Container>
      <TextB2R>등록된 휴대폰 번호를 입력해 주시면</TextB2R>
      <TextB2R>해당 번호로 이메일 주소를 보내드립니다.</TextB2R>
      <InputWrapper>
        <TextInput placeholder="이름" ref={nameRef} eventHandler={nameInputHandler} />
        <TextInput
          placeholder="휴대폰 번호 입력 (-제외)"
          margin="8px 0 0 0"
          ref={phoneRef}
          inputType="number"
          eventHandler={phoneInputHandler}
        />
        {errorMessage && <Validation>{errorMessage}</Validation>}
      </InputWrapper>
      <BtnWrapper onClick={getHelpEmail}>
        <Button disabled={!isAllValid} height="100%" borderRadius="0">
          요청하기
        </Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 84px 24px;
`;

const InputWrapper = styled.div`
  margin-top: 28px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;

export default FindEmailPage;
