import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextB3R, TextH3B } from '@components/Shared/Text';
import { theme, fixedBottom } from '@styles/theme';
import Button from '@components/Shared/Button';
import { useRouter } from 'next/router';

function spotReq() {
  const router = useRouter();
  const text = {
    publicText: '현재 xxxx명이\n프코스팟을 이용해요',
    publicDesc: '내 주변 단골 가게를 프코스팟으로\n만들고 편하게 픽업하세요!',
    normalDesc: '우리 가게를 프코스팟으로 만들고\n더 많은 고객들을 만나보세요!',
    fcospotText: '단골카페를 프코스팟으로',
    privateText: '우리 회사 학교를\n프코스팟으로',
    privateDesc:
      '우리 회사 학교에서 점심 저녁 원하는 시간으로\n샐러드 무료로 배송받기',
    privateBtnText: '프라이빗 스팟 신청하기',
    askText: '프코스팟 신청이 어려우신가요?',
    askBtnText: '채팅문의',
    registerBtn: '신청하기',
  };
  const { type } = router.query;
  const mainText = () => {
    switch (type) {
      case 'private': {
        return { text1: text.privateText, text2: text.privateDesc };
      }
      case 'public': {
        return { text1: text.publicText, text2: text.publicDesc };
      }
      case 'normal': {
        return { text1: text.publicText, text2: text.normalDesc };
      }
      default: {
        return;
      }
    }
  };

  const goToRegister = () => {
    router.push({
      pathname: '/spot/register',
      query: { type },
    });
  };
  return (
    <Container>
      <TopWrapper>
        <TextH2B>{mainText()?.text1}</TextH2B>
        <TextB3R margin="33px 0 48px 0" color={theme.greyScale65}>
          {mainText()?.text2}
        </TextB3R>
      </TopWrapper>
      <GuideWrapper>
        <Guide></Guide>
      </GuideWrapper>
      <BottomWrapper>
        {type !== 'normal' && (
          <>
            <BtnWrapper>
              <TextH3B margin="0 0 24px 0">{text.fcospotText}</TextH3B>
              <Button
                pointer
                backgroundColor={theme.white}
                color={theme.black}
                border
                borderRadius="8"
                onClick={goToRegister}
              >
                {text.registerBtn}
              </Button>
            </BtnWrapper>
            <Row />
          </>
        )}
        <BtnWrapper>
          {/* TODO 채널톡 작업 */}
          <TextH3B margin="0 0 24px 0">{text.askText}</TextH3B>
          <Button
            pointer
            backgroundColor={theme.white}
            color={theme.black}
            border
            borderRadius="8"
          >
            {text.askBtnText}
          </Button>
        </BtnWrapper>
      </BottomWrapper>
      <FixedButton onClick={goToRegister}>
        <Button borderRadius="0">
          {type === 'private'
            ? '프라이빗 프코스팟 신청하기'
            : '프코스팟 신청하기'}
        </Button>
      </FixedButton>
    </Container>
  );
}

const Container = styled.main`
  padding: 24px;
`;
const TopWrapper = styled.section``;

const GuideWrapper = styled.section`
  width: 100%;
  height: 412px;
  background: ${theme.greyScale25};
  margin-bottom: 48px;
`;

const Guide = styled.div``;

const BottomWrapper = styled.section`
  margin: 0 auto;
`;

const BtnWrapper = styled.div``;

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 32px 0;
`;
const FixedButton = styled.section`
  ${fixedBottom}
`;

export default spotReq;
