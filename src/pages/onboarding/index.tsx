import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import bg from '@public/images/onBoarding.png';
import Image from 'next/image';
import { breakpoints } from '@utils/common/getMediaQuery';
import { TextH5B, TextH1B, TextH6B } from '@components/Shared/Text';
import { theme, FlexCol } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import router, { useRouter } from 'next/router';
import { Tag } from '@components/Shared/Tag';
import { Obj } from '@model/index';
import axios from 'axios';
import { SET_LOGIN_SUCCESS } from '@store/user';
import { useSelector, useDispatch } from 'react-redux';
// import { setRefreshToken } from '@components/Auth';
import { setCookie } from '@utils/common';
import { commonSelector, SET_LOGIN_TYPE } from '@store/common';
import { userForm } from '@store/user';
declare global {
  interface Window {
    Kakao: any;
  }
}

declare global {
  interface Window {
    AppleID: any;
  }
}

const OnBoarding: NextPage = () => {
  const emailButtonStyle = {
    backgroundColor: theme.white,
    color: theme.black,
  };

  const kakaoButtonStyle = {
    backgroundColor: '#F9DF33',
    color: theme.black,
    width: '100%',
  };

  const lastLoginTagStyleMapper: Obj = {
    KAKAO: 40,
    APPLE: 40,
    EMAIL: 15,
  };

  const dispatch = useDispatch();
  const [returnPath, setReturnPath] = useState<string | string[]>('');
  const onRouter = useRouter();
  const { loginType } = useSelector(commonSelector);

  useEffect(() => {
    setReturnPath(onRouter.query.returnPath || '/');
  }, []);

  const kakaoLoginHandler = () => {
    /* 웹뷰 */

    // window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-sign-kakao' }));
    // return;

    if (typeof window !== undefined) {
      window.Kakao.Auth.authorize({
        redirectUri:
          location.hostname === 'localhost' ? 'http://localhost:9009/oauth' : `${process.env.SERVICE_URL}/oauth`,
        scope: 'profile,plusfriends,account_email,gender,birthday,birthyear,phone_number',
      });
    }
  };

  /* TODO: 나중에 도메인 나오면 redirectUrl 수정해야 함  */
  const appleLoginHandler = async () => {
    if (typeof window !== undefined) {
      window.AppleID.auth.init({
        clientId: 'com.freshcode.www',
        scope: 'email',
        redirectURI: `${process.env.SERVICE_URL}`,
        usePopup: true,
      });
      try {
        const data = await window.AppleID.auth.signIn();
        console.log(data, 'aftter APPLE');
        // authorization: {
        //   code: string, id_token:string
        // }
        if (data.authorization.id_token) {
          // 애플 로그인 / 회원가입 호출?
          router.replace('/signup?isApple=true');
        }
      } catch (error: any) {
        console.log(`Error: ${error && error.error}`);
      }
    }
  };

  const emailSignUpHandler = (): void => {
    router.push('/signup');
  };

  const emailLoginHandler = (): void => {
    if (returnPath === onRouter.query.returnPath) {
      router.push(`/login?returnPath=${encodeURIComponent(String(returnPath))}`);
    } else {
      router.push('/login');
    }
  };

  const goToHomeWithoutLogin = () => {
    router.push('/');
  };

  const renderLastLoginTag = (): JSX.Element => {
    return (
      <TagWrapper left={lastLoginTagStyleMapper[loginType]}>
        <Tag color={theme.white} backgroundColor={theme.brandColor}>
          최근 로그인
        </Tag>
      </TagWrapper>
    );
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
          <KakaoBtn onClick={() => kakaoLoginHandler()}>
            <Button {...kakaoButtonStyle}>카카오로 3초만에 시작하기</Button>
            <SVGIcon name="kakaoBuble" />
            {loginType === 'KAKAO' && renderLastLoginTag()}
          </KakaoBtn>
          <AppleBtn onClick={appleLoginHandler}>
            <Button>Apple로 시작하기</Button>
            <SVGIcon name="appleIcon" />
            {loginType === 'APPLE' && renderLastLoginTag()}
          </AppleBtn>
          <EmailLoginAndSignUp>
            <Button {...emailButtonStyle} onClick={emailLoginHandler}>
              이메일로 로그인
            </Button>
            <Button {...emailButtonStyle} onClick={emailSignUpHandler} margin="0 0 0 8px">
              이메일로 회원가입
            </Button>
            {loginType === 'EMAIL' && renderLastLoginTag()}
          </EmailLoginAndSignUp>
          <TextH6B
            color={theme.white}
            textDecoration="underline"
            padding="24px 0 0 0"
            onClick={goToHomeWithoutLogin}
            pointer
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
  right: 0;
  left: calc(50%);
  z-index: 100;
  height: 100vh;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left:0px;
  `};
  ${({ theme }) => theme.mobile`
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
  position: relative;
  margin-bottom: 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmailLoginAndSignUp = styled.div`
  position: relative;
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
    bottom: 36%;

    ${({ theme }) => theme.mobile`
    left: 20%;
  `};

    ${({ theme }) => theme.sm`
    left: 15%;
  `};
  }
`;

const AppleBtn = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  svg {
    position: absolute;
    left: 34%;
    bottom: 36%;

    ${({ theme }) => theme.mobile`
      left: 28%;
  `};

    ${({ theme }) => theme.sm`
      left: 25%;
  `};
  }
`;

const TagWrapper = styled.div<{ left?: number }>`
  position: absolute;
  top: -20%;
  left: ${({ left }) => left && left + 3}%;
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));

  ${({ theme, left }) => theme.mobile`
    left: ${`${left}%`}
  `};

  :after,
  :before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 0;
    height: 0;
    border-style: solid;
  }
  :after {
    left: 45%;
    bottom: -7px;
    border-color: ${theme.brandColor} transparent transparent transparent;
    border-width: 4px;
  }

  :before {
    left: 45%;
    bottom: -7px;
    border-color: ${theme.brandColor} transparent transparent transparent;
    border-width: 4px;
  }
`;

export default OnBoarding;
