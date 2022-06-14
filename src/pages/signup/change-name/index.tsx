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
import { userChangeInfo } from '@api/user';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { WelcomeSheet } from '@components/BottomSheet/WelcomeSheet';
import Validation from '@components/Pages/User/Validation';

const ChangeNamePage = () => {
  const [name, setName] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const { me } = useSelector(userForm);

  const dispatch = useDispatch();

  const clearNameHandler = () => {
    setName('');
  };

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setName(value);
  };

  const finishChangeName = async () => {
    if (!NAME_REGX.test(name)) {
      setIsError(true);
      return;
    }

    const reqBody = {
      authCode: null,
      birthDate: me?.birthDate || '',
      gender: me?.gender || 'NONE',
      email: me?.email!,
      marketingEmailReceived: me?.marketingEmailReceived!,
      marketingPushReceived: me?.marketingPushReceived!,
      marketingSmsReceived: me?.marketingSmsReceived!,
      name: name,
      nickName: me?.nickName || name,
      notiPushReceived: me?.notiPushReceived!,
      primePushReceived: me?.primePushReceived!,
      tel: me?.tel!,
    };
    try {
      const { data } = await userChangeInfo(reqBody);

      if (data.code === 200) {
        dispatch(SET_BOTTOM_SHEET({ content: <WelcomeSheet /> }));
      }
    } catch (error) {}
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      finishChangeName();
    }
  };

  useEffect(() => {
    setName(me?.name!);
  }, []);

  return (
    <Container>
      <Wrapper>
        <TextWrap>
          <TextH2B>서비스 이용을 위해</TextH2B>
          <TextH2B>이름을 변경해 주세요</TextH2B>
        </TextWrap>
        <FlexCol>
          <TextH5B>이름</TextH5B>
          <TextWrapper>
            <TextInput
              placeholder="기존 비밀번호 입력"
              margin="8px 0 0 0"
              value={name}
              eventHandler={changeNameHandler}
              keyPressHandler={handleKeyPress}
            />
            {name.length > 0 && (
              <DeleteName onClick={clearNameHandler}>
                <SVGIcon name="blackBackgroundCancel" />
              </DeleteName>
            )}
          </TextWrapper>
          {(!NAME_REGX.test(name) || isError) && (
            <Validation>최소 2자 최대 20자 이내, 한글/영문만 입력 가능해요.</Validation>
          )}
        </FlexCol>
      </Wrapper>
      <NextBtnWrapper onClick={finishChangeName}>
        <Button height="100%" borderRadius="0">
          변경하기
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
