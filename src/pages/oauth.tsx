import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SET_LOGIN_SUCCESS, SET_USER_AUTH, SET_USER } from '@store/user';
import { SET_LOGIN_TYPE } from '@store/common';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Obj } from '@model/index';
import { NAME_REGX } from '@constants/regex';
import { userProfile } from '@api/user';
import { userLoginApi } from '@api/authentication';
import { SET_ALERT } from '@store/alert';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { WelcomeSheet } from '@components/BottomSheet/WelcomeSheet';
interface IAuthObj {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
}

const Oauth = () => {
  const kakaoHeader = {
    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  };

  const router = useRouter();
  const dispatch = useDispatch();
  const { code } = router.query;
  const recommendCode = sessionStorage.getItem('recommendCode');

  const onSuccessKakao = async (authObj: IAuthObj) => {
    window.Kakao.Auth.setAccessToken(authObj.access_token);

    try {
      const result = await userLoginApi({
        loginType: 'KAKAO',
        accessToken: `bearer ${authObj.access_token}`,
      });

      if (result.data.code === 200) {
        const userTokenObj = result.data.data;
        const isRegister = result?.data?.data?.isJoin;

        dispatch(SET_USER_AUTH(userTokenObj));
        dispatch(SET_LOGIN_SUCCESS(true));
        dispatch(SET_LOGIN_TYPE('KAKAO'));

        const { data } = await userProfile().then((res) => {
          return res?.data;
        });

        dispatch(SET_USER(data));

        const needToChangeName = !NAME_REGX.test(data.name) || data.name.length === 0;

        if (isRegister) {
          if (needToChangeName) {
            router.push({ pathname: '/signup/change-name', query: { isKakao: true } });
          } else {
            dispatch(SET_BOTTOM_SHEET({ content: <WelcomeSheet recommendCode={recommendCode as string} /> }));
          }
        } else {
          recommendCode ? router.push(`/mypage/friend`) : router.push('/');
        }
      }
    } catch ({ response }) {
      const { data: error } = response as any;

      if (error.code === 2010) {
        dispatch(
          SET_ALERT({
            alertMessage: '탈퇴한 번호입니다. 탈퇴한 날부터 30일 이후 재가입 가능해요.',
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      } else if (error.code === 2106) {
        dispatch(
          SET_ALERT({
            alertMessage: '카카오톡 인증 정보를 다시 확인해 주세요.',
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      } else if (error.code === 2107) {
        dispatch(
          SET_ALERT({
            alertMessage:
              '휴대폰 번호가 등록되지 않은 카카오톡 계정입니다. 먼저 카카오톡 계정에 휴대폰 번호를 인증해 주세요.',
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      } else if (error.code === 2108) {
        dispatch(
          SET_ALERT({
            alertMessage: '프레시코드는 국내 휴대폰 번호로만 카카오 소셜로그인이 가능해요.',
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      } else if (error.code === 2007) {
        dispatch(
          SET_ALERT({
            alertMessage: '이미 가입되어 있는 회원입니다.',
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      } else if (error.code === 2000) {
        dispatch(
          SET_ALERT({
            alertMessage: '이미 사용 중인 휴대폰 번호예요.',
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      } else if (error.code === 2012) {
        dispatch(
          SET_ALERT({
            alertMessage: '이미 사용 중인 이메일 주소예요.',
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      } else {
        dispatch(
          SET_ALERT({
            alertMessage: error.message,
            onSubmit: () => {
              goToOnboarding();
            },
          })
        );
      }
    }
  };

  const goToOnboarding = () => {
    router.replace('/onboarding');
  };

  const initKakaoAuth = async () => {
    try {
      const qs: Obj = {
        grant_type: 'authorization_code',
        client_id: 'afb3a1413cc8d2c864a74358105771a9',
        redirectUri:
          location.hostname === 'localhost' ? 'http://localhost:9009/oauth' : `${process.env.SERVICE_URL}/oauth`,
        code,
      };

      const queryString = Object.keys(qs)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(qs[k]))
        .join('&');

      const { data } = await axios.post('https://kauth.kakao.com/oauth/token', queryString, {
        headers: kakaoHeader,
      });
      onSuccessKakao(data);
    } catch (error) {
      router.replace('/login');
    }
  };

  useEffect(() => {
    if (router.isReady) {
      initKakaoAuth();
    }
  }, [router.isReady]);

  return <div></div>;
};

export default Oauth;
