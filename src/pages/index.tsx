import type { NextPage } from 'next';
import styled from 'styled-components';
import bg from '@public/images/onBoarding.png';
import Image from 'next/image';
import { breakpoints } from '@utils/getMediaQuery';
import { TextH5B, TextH1B, TextH6B } from '@components/Text';
import { theme, FlexCol } from '@styles/theme';
import Button from '@components/Button';
import SVGIcon from '@utils/SVGIcon';

const index: NextPage = () => {
  const emailButtonStyle = {
    backgroundColor: theme.white,
    color: theme.black,
  };
  const kakaoButtonStyle = {
    backgroundColor: '#F9DF33',
    color: theme.black,
    width: '100%',
  };

  return (
    <Container>
      <Image src={bg} layout="fill" />
      <Wrapper>
        <FlexCol padding="90px 0 0 0">
          <TextH1B color={theme.white}>건강한 일상도,</TextH1B>
          <TextH1B color={theme.white}>프리미엄 샐러드도</TextH1B>
          <TextH1B color={theme.white}>프레시코드</TextH1B>
          <TextH5B padding="17px 0 0 0" color={theme.white}>
            샐러드·건강편의식 거점 배송서비스
          </TextH5B>
        </FlexCol>
        <ButtonWrapper>
          <KakaoBtn>
            <Button {...kakaoButtonStyle}>카카오로 3초만에 시작하기</Button>
            <SVGIcon name="kakaoBuble" />
          </KakaoBtn>
          <AppleBtn>
            <Button>Apple로 시작하기</Button>
            <SVGIcon name="appleIcon" />
          </AppleBtn>
          <EmailLoginAndSignIn>
            <Button {...emailButtonStyle} margin="0 8px 0 0">
              이메일로 로그인
            </Button>
            <Button {...emailButtonStyle}>이메일로 회원가입</Button>
          </EmailLoginAndSignIn>
          <TextH6B
            color={theme.white}
            textDecoration="underline"
            padding="24px 0 0 0"
          >
            먼저 둘러볼게요.
          </TextH6B>
        </ButtonWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.main`
  position: fixed;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  top: 0;
  left: calc(50%);
  z-index: 100;
  height: 100vh;

  ${({ theme }) => theme.desktop`
    height: 100vh;
    margin: 0 auto;
    left: 25%;
  `};
  ${({ theme }) => theme.mobile`
    width:100%;
    margin: 0 auto;
    left: 0px;
  `};

  :after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: '';
    background: rgba(36, 36, 36, 0.5);
  }
`;

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  padding: 0 32px;
  z-index: 101;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmailLoginAndSignIn = styled.div`
  display: flex;
  width: 100%;
`;

const KakaoBtn = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  svg {
    position: absolute;
    left: 28%;
    bottom: 35%;
  }
`;

const AppleBtn = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  svg {
    position: absolute;
    left: 35%;
    bottom: 38%;
  }
`;

export default index;
