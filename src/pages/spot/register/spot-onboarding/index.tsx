import React, { ReactElement, useState, useRef } from 'react';
import styled from 'styled-components';
import { theme, homePadding, FlexRow, fixedBottom } from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import { TextB2R, TextH4B, TextH2B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';

const SpotOnboardingPage = (): ReactElement => {
  const router = useRouter();
  const { type } = router.query;
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const managerRef = useRef<HTMLInputElement>(null);

  const [managerChecked, setManagerChecked] = useState<boolean>(false);

  const goToNextPage = (): void => {
    if (type === 'private') {
      router.replace({
        pathname: '/spot/register/submit',
        query: { type },
      });
    } else {
      router.push({
        pathname: '/spot/register/submit',
        query: { type },
      });
    }
  };

  const noticeHandler = () => {
    setManagerChecked(!managerChecked);
  };

  return (
    <Container>
      <Wrapper>
        <TextH2B margin="0 0 56px 0">
          {type === 'private'
            ? `신청자에 대한\n정보를 알려주세요.`
            : `예비 프로스팟 파트너에 대한\n정보를 알려주세요`}
        </TextH2B>
        <InputWrapper>
          <TextH4B margin="0 0 16px 0">이름</TextH4B>
          <TextInput placeholder="이름 입력" ref={nameRef} />
        </InputWrapper>
        <InputWrapper>
          <TextH4B margin="0 0 16px 0">이메일</TextH4B>
          <TextInput placeholder="이메일 입력" ref={emailRef} />
        </InputWrapper>
        <InputWrapper>
          <TextH4B margin="0 0 16px 0">연락처</TextH4B>
          <TextInput placeholder="휴대폰 번호 (-제외)" ref={telRef} />
        </InputWrapper>
        {type === 'owner' && (
          <>
            <InputWrapper>
              <TextH4B margin="0 0 16px 0">직급/호칭</TextH4B>
              <TextInput placeholder="직급 또는 호칭 입력" ref={managerRef} />
            </InputWrapper>
            <BottomWrapper>
              <FlexRow>
                <Checkbox onChange={noticeHandler} isSelected={managerChecked} />
                <TextB2R margin="0 0 0 8px" padding='3px 0 0 0'>
                  신청자가 장소관리자임을 확인했습니다.
                </TextB2R>
              </FlexRow>
            </BottomWrapper>
          </>
        )}
      </Wrapper>
      <FixedButton onClick={goToNextPage}>
        <Button borderRadius="0">다음</Button>
      </FixedButton>
    </Container>
  );
};

const Container = styled.main``;

const Wrapper = styled.div`
  ${homePadding};
`;

const InputWrapper = styled.div`
  margin-bottom: 32px;
`;

const BottomWrapper = styled.section`
`;

const FixedButton = styled.section`
  ${fixedBottom}
`;

export default SpotOnboardingPage;
