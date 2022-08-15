import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { TextH6B, TextH3B, TextB2R } from '@components/Shared/Text';
import { theme, FlexCol } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { useRouter } from 'next/router';
import { Tag } from '@components/Shared/Tag';
import { IAuthObj, Obj } from '@model/index';
import { SET_LOGIN_SUCCESS, SET_SIGNUP_USER } from '@store/user';
import { useSelector, useDispatch } from 'react-redux';
import { commonSelector, SET_LOGIN_TYPE } from '@store/common';
import { SET_USER_AUTH, SET_USER } from '@store/user';
import { getAppleTokenApi, userProfile } from '@api/user';
import { userLoginApi } from '@api/authentication';
import { SET_ALERT } from '@store/alert';
import { useAppleLogin, useKakaoLogin } from '@hooks/auth';
import useIsApp from '@hooks/useIsApp';

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

  const router = useRouter();
  const dispatch = useDispatch();
  const { loginType } = useSelector(commonSelector);
  const [returnPath, setReturnPath] = useState<string | string[]>('');

  const onKaKao = useKakaoLogin();
  const onApple = useAppleLogin();

  const { recommendCode } = router.query;

  useEffect(() => {
    setReturnPath(router.query.returnPath || '/');
  }, [router.query.returnPath]);

  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.addEventListener('message', webviewListener);
    }
    return () => {
      window.removeEventListener('message', webviewListener);
    };
  }, [window.ReactNativeWebView]);

  const isApp = useIsApp();

  const webviewListener = async (e: any) => {
    let { cmd, data = null } = await JSON.parse(e.data);
    switch (cmd) {
      case 'rn-sign-kakao':
        onKaKao({
          access_token: data.accessToken,
          expires_in: data.accessTokenExpiresAt,
          refresh_token: data.refreshToken,
          refresh_token_expires_in: data.refreshTokenExpiresAt,
          scope: data.scopes,
          token_type: 'bearer',
        });
        break;
      case 'rn-sign-apple':
        onApple(data);
        break;

      default:
        break;
    }
  };

  const kakaoLoginHandler = () => {
    /* 웹뷰 */
    if (isApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-sign-kakao' }));
    } else {
      const url =
        location.hostname === 'localhost' ? 'http://localhost:9009/oauth' : `${process.env.SERVICE_URL}/oauth`;

      recommendCode && sessionStorage.setItem('recommendCode', recommendCode as string);
      window.Kakao.Auth.authorize({
        redirectUri: url,
        scope: 'profile,plusfriends,account_email,gender,birthday,birthyear,phone_number',
      });
    }
  };

  /* TODO: 나중에 도메인 나오면 redirectUrl 수정해야 함  */
  const appleLoginHandler = async () => {
    if (typeof window !== undefined) {
      if (isApp) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-sign-apple' }));
      } else {
        window.AppleID.auth.init({
          clientId: 'com.freshcode.www',
          scope: 'email',
          redirectURI: `${process.env.SERVICE_URL}`,
          usePopup: true,
        });
        try {
          const appleResponse = await window.AppleID.auth.signIn();
          const appleToken = appleResponse?.authorization.id_token;
          recommendCode && sessionStorage.setItem('recommendCode', recommendCode as string);

          if (appleToken) {
            const params = { appleToken };
            const { data } = await getAppleTokenApi({ params });
            if (data.data.availability) {
              dispatch(SET_SIGNUP_USER({ email: data.data.email }));
              localStorage.setItem('appleToken', appleToken);
              router.replace('/signup?isApple=true');
            } else {
              const result = await userLoginApi({ accessToken: `${appleToken}`, loginType: 'APPLE' });
              if (result.data.code == 200) {
                const userTokenObj = result.data?.data;

                dispatch(SET_USER_AUTH(userTokenObj));
                dispatch(SET_LOGIN_SUCCESS(true));
                dispatch(SET_LOGIN_TYPE('APPLE'));

                const { data } = await userProfile().then((res) => {
                  return res?.data;
                });

                dispatch(SET_USER(data));
                // success
                recommendCode ? router.replace('/mypage/friend') : router.push('/');
              }
            }
          }
        } catch (error: any) {
          if (error.code === 2103) {
            dispatch(SET_ALERT({ alertMessage: '잘못된 애플 토큰입니다.' }));
          } else if (error.code === 2102) {
            dispatch(SET_ALERT({ alertMessage: '애플 토큰이 만료되었습니다.' }));
          } else if (error.code === 2101) {
            dispatch(SET_ALERT({ alertMessage: '애플 인증정보가 잘못되었습니다.' }));
          } else if (error.code === 2104) {
            dispatch(SET_ALERT({ alertMessage: '애플 회원 정보를 찾을 수 없습니다.' }));
          } else {
            dispatch(SET_ALERT({ alertMessage: `${error.message}` }));
          }
        }
      }
    }
  };

  const emailSignUpHandler = (): void => {
    const { recommendCode } = router.query;
    recommendCode && sessionStorage.setItem('recommendCode', recommendCode as string);
    router.push('/signup');
  };

  const emailLoginHandler = (): void => {
    const hasReturnPath = returnPath === router.query.returnPath;
    const { recommendCode } = router.query;

    switch (true) {
      case hasReturnPath: {
        router.push(`/login?returnPath=${encodeURIComponent(String(returnPath))}`);
        return;
      }
      default: {
        recommendCode && sessionStorage.setItem('recommendCode', recommendCode as string);
        router.push('/login');
        return;
      }
    }
  };

  const goToHomeWithoutLogin = () => {
    // router.replace(`${returnPath}`, null);
    // TODO : returnPath를 가지고 onBoarding으로 이동 => 둘러보기 클릭 => returnPath로 이동 => 뒤로가기 클릭시 다시 onBoarding으로 이동
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
      {/* <Image height={321} width={360} src={bg} alt="onboarding img" /> */}
      <Wrapper>
        <BrandImg></BrandImg>
        <ButtonWrapper>
          <FlexCol padding="0 0 32px">
            <TextH3B padding="0 0 7px" center>
              안녕하세요! 👋
            </TextH3B>
            <TextB2R center color={theme.greyScale65}>
              지금 바로 가입하고 다양한 혜택 받아가세요.
            </TextB2R>
          </FlexCol>
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
            <Button {...emailButtonStyle} onClick={emailLoginHandler} backgroundColor={theme.greyScale3}>
              이메일로 로그인
            </Button>
            <Button
              {...emailButtonStyle}
              onClick={emailSignUpHandler}
              margin="0 0 0 8px"
              backgroundColor={theme.greyScale3}
            >
              이메일로 회원가입
            </Button>
            {loginType === 'EMAIL' && renderLastLoginTag()}
          </EmailLoginAndSignUp>
          <TextH6B
            color={theme.greyScale65}
            textDecoration="underline"
            padding="32px 0 0 0"
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
    left: 0px;
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
    /* background: rgba(36, 36, 36, 0.5); */
  }
`;

const Wrapper = styled.div`
  padding-top: 32px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  z-index: 101;
`;

const BrandImg = styled.div`
  width: 100%;
  height: 320px;
  background-color: ${theme.greyScale3};
`;

const ButtonWrapper = styled.div`
  position: relative;
  padding: 0 32px 32px 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* ${({ theme }) => theme.mobile`
    top: -7%;
  `}; */
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
  top: -30%;
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
