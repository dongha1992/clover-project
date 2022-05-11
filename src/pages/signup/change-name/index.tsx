import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextH2B, TextH5B } from '@components/Shared/Text';
import { FlexCol, homePadding, fixedBottom } from '@styles/theme';
import { useDispatch } from 'react-redux';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';

const ChangeNamePage = () => {
  const [name, setName] = useState<string>('');

  const dispatch = useDispatch();

  const finishChangeName = () => {};

  const clearNameHandler = () => {};
  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
  };

  return (
    <Container>
      <Wrapper>
        <TextWrap>
          <TextH2B>마지막으로</TextH2B>
          <TextH2B>더 알고 싶어요</TextH2B>
        </TextWrap>
        <FlexCol>
          <TextH5B>이름</TextH5B>
          <TextInput
            placeholder="기존 비밀번호 입력"
            margin="8px 0 0 0"
            value={name}
            eventHandler={changeNameHandler}
          />

          <DeleteName onClick={clearNameHandler}>
            <SVGIcon name="blackBackgroundCancel" />
          </DeleteName>
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
const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;
const DeleteName = styled.div``;

export default ChangeNamePage;
