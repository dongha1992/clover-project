import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextB3R, TextH2B, TextH5B } from '@components/Shared/Text';
import { FlexCol, homePadding, fixedBottom, FlexRow, theme } from '@styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { NAME_REGX } from '@constants/regex';
import { userForm } from '@store/user';
import { SET_SIGNUP_USER } from '@store/user';
import router from 'next/router';

const ChangeNamePage = () => {
  const [name, setName] = useState<string>('');
  const { signupUser } = useSelector(userForm);

  const dispatch = useDispatch();

  const clearNameHandler = () => {
    setName('');
  };

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setName(value);
  };

  const finishChangeName = () => {
    dispatch(
      SET_SIGNUP_USER({
        loginType: 'kakao',
        name,
      })
    );
    router.push('/signup/optional');
  };

  useEffect(() => {
    setName(signupUser?.name!);
  }, []);

  return (
    <Container>
      <Wrapper>
        <TextWrap>
          <TextH2B>마지막으로</TextH2B>
          <TextH2B>더 알고 싶어요</TextH2B>
        </TextWrap>
        <FlexCol>
          <TextH5B>이름</TextH5B>
          <TextWrapper>
            <TextInput
              placeholder="기존 비밀번호 입력"
              margin="8px 0 0 0"
              value={name}
              eventHandler={changeNameHandler}
            />
            {name.length > 0 && (
              <DeleteName onClick={clearNameHandler}>
                <SVGIcon name="blackBackgroundCancel" />
              </DeleteName>
            )}
          </TextWrapper>
          {!NAME_REGX.test(name) && <TextB3R color={theme.systemRed}>한글/영문만 사용 가능합니다.</TextB3R>}
        </FlexCol>
      </Wrapper>
      <NextBtnWrapper onClick={finishChangeName}>
        <Button height="100%" borderRadius="0">
          다음
        </Button>
      </NextBtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;
const Wrapper = styled.div``;
const TextWrap = styled.div`
  padding: 32px 0 56px 0;
`;
const TextWrapper = styled.div`
  position: relative;
  padding: 8px 0 0 0;
`;
const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;
const DeleteName = styled.div`
  position: absolute;
  right: 5%;
  bottom: 20%;
`;

export default ChangeNamePage;
