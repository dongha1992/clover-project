import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import bg from '@public/images/onBoarding.png';
import Image from 'next/image';
import { breakpoints } from '@utils/getMediaQuery';
import { TextH5B, TextH1B, TextH6B } from '@components/Shared/Text';
import { theme, FlexCol } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import SVGIcon from '@utils/SVGIcon';
import router, { useRouter } from 'next/router';
import { Tag } from '@components/Shared/Tag';
import { Obj } from '@model/index';
import axios from 'axios';
import { SET_LOGIN_SUCCESS, userForm } from '@store/user';
import { useSelector, useDispatch } from 'react-redux';
// import { setRefreshToken } from '@components/Auth';
import { userLogin } from '@api/user';
import { setCookie } from '@utils/cookie';
import { SET_LOGIN_TYPE } from '@store/common';

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

  const lastLogin = ['kakao', 'apple', 'email'][Math.floor(Math.random() * 3)];

  const lastLoginTagStyleMapper: Obj = {
    kakao: 40,
    apple: 40,
    email: 15,
  };

  const { user } = useSelector(userForm);
  const dispatch = useDispatch();
  const [returnPath, setReturnPath] = useState<string | string[]>('');
  const onRouter = useRouter();

  useEffect(() => {
    setReturnPath(onRouter.query.returnPath || '/');
  }, []);

  const kakaoLoginHandler = async (): Promise<void> => {
    window.Kakao.Auth.login({
      success: async (res: any) => {
        const data = {
          accessToken: res.access_token,
          tokenType: res.token_type,
        };

        const result = await axios.post('https://dev-api.freshcode.me/user/v1/signin-kakao', data);

        if (window.Kakao) {
          window.Kakao.cleanup();
        }
        // TODO : 여기가 카카오 로그인 성공부분인가요??
        dispatch(SET_LOGIN_TYPE('KAKAO'));
        dispatch(SET_LOGIN_SUCCESS(true));
      },
      fail: async (res: any) => {
        alert(`${res.error}-${res.error_error_description}`);
      },
    });
  };

  /* TODO:  apple login 테스트 해야함 */

  const appleLoginHandler = async () => {
    await loginTest();
    // AppleID.auth.init({
    //   clientId: 'com.freshcode.www',
    //   scope: 'email',
    //   redirectURI: 'https://www.freshcode.me',
    //   usePopup: true,
    // });
    // try {
    //   await AppleID.auth.signIn();
    // } catch (error) {
    //   console.log(`Error: ${error && error.error}`);
    // }
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

  const loginTest = async () => {
    const { data } = await userLogin({
      email: 'david@freshcode.me',
      password: '12341234',
      loginType: 'EMAIL',
    });

    if (data.code === 200) {
      let userTokenObj = data.data;
      const accessTokenObj = {
        accessToken: userTokenObj?.accessToken,
        expiresIn: userTokenObj?.expiresIn,
      };

      sessionStorage.setItem('accessToken', JSON.stringify(accessTokenObj));

      const refreshTokenObj = JSON.stringify({
        refreshToken: userTokenObj?.refreshToken,
        refreshTokenExpiresIn: userTokenObj?.refreshTokenExpiresIn,
      });

      setCookie({
        name: 'refreshTokenObj',
        value: refreshTokenObj,
        option: {
          path: '/',
          maxAge: userTokenObj?.refreshTokenExpiresIn,
        },
      });
    }
  };

  const renderLastLoginTag = (): JSX.Element => {
    return (
      <TagWrapper left={lastLoginTagStyleMapper[lastLogin]}>
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
          <KakaoBtn onClick={kakaoLoginHandler}>
            <Button {...kakaoButtonStyle}>카카오로 3초만에 시작하기</Button>
            <SVGIcon name="kakaoBuble" />
            {lastLogin === 'kakao' && renderLastLoginTag()}
          </KakaoBtn>
          <AppleBtn onClick={appleLoginHandler}>
            <Button>Apple로 시작하기</Button>
            <SVGIcon name="appleIcon" />
            {lastLogin === 'apple' && renderLastLoginTag()}
          </AppleBtn>
          <EmailLoginAndSignUp>
            <Button {...emailButtonStyle} onClick={emailLoginHandler}>
              이메일로 로그인
            </Button>
            <Button {...emailButtonStyle} onClick={emailSignUpHandler} margin="0 0 0 8px">
              이메일로 회원가입
            </Button>
            {lastLogin === 'email' && renderLastLoginTag()}
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