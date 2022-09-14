import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { fixedBottom, theme } from '@styles/theme';
import Validation from '@components/Pages/User/Validation';
import { PHONE_REGX, NAME_REGX } from '@pages/signup/auth';
import dynamic from 'next/dynamic';
import { userHelpEmail } from '@api/user';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';

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

  const dispatch = useDispatch();

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
        setErrorMessage('');
      } else {
        setPhoneValid({ ...phoneValid, isValid: false });
        setErrorMessage('휴대폰 번호를 정확히 입력해 주세요.');
      }
    }
  };

  const getHelpEmail = async () => {
    if (!isAllValid) return;
    setErrorMessage('');
    if (phoneRef.current && nameRef.current) {
      const name = nameRef.current?.value;
      const tel = phoneRef.current?.value.toString();

      try {
        const { data } = await userHelpEmail({ name, tel });

        if (data.code === 200) {
          dispatch(SET_ALERT({ alertMessage: '입력하신 휴대폰 번호로 이메일 주소를 보냈어요.' }));
        }
      } catch (error: any) {
        if (error.code === 2008) {
          dispatch(SET_ALERT({ alertMessage: '카카오로 가입한 계정입니다. 카카오로 로그인해 주세요.' }));
        } else if (error.code === 2007) {
          dispatch(SET_ALERT({ alertMessage: '애플로 가입한 계정입니다. 애플로 로그인해 주세요.' }));
        } else {
          setErrorMessage('입력하신 정보로 일치하는 계정이 없습니다.');
        }
        console.error(error);
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      getHelpEmail();
    }
  };

  useEffect(() => {}, [nameRef, phoneRef]);

  const isAllValid = nameValid.isValid && phoneValid.isValid;

  return (
    <Container>
      <TextB2R>등록된 휴대폰 번호를 입력해 주시면</TextB2R>
      <TextB2R>해당 번호로 이메일 주소를 보내드립니다.</TextB2R>
      <InputWrapper>
        <TextH5B padding="0 0 8px 0">이름</TextH5B>
        <TextInput placeholder="이름" ref={nameRef} eventHandler={nameInputHandler} keyPressHandler={handleKeyPress} />
        <TextH5B padding="24px 0 8px 0">휴대폰 번호</TextH5B>
        <TextInput
          placeholder="휴대폰 번호 입력 (-제외)"
          ref={phoneRef}
          inputType="number"
          eventHandler={phoneInputHandler}
          keyPressHandler={handleKeyPress}
        />
        {errorMessage && <Validation>{errorMessage}</Validation>}
      </InputWrapper>
      <BtnWrapper onClick={getHelpEmail}>
        <Button disabled2={!isAllValid} height="100%" borderRadius="0">
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
