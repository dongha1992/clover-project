import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SET_LOGIN_SUCCESS, SET_SIGNUP_USER, SET_USER_AUTH, SET_USER } from '@store/user';
import { SET_LOGIN_TYPE } from '@store/common';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Obj } from '@model/index';
import { NAME_REGX } from '@constants/regex';
import { userLoginApi, userProfile } from '@api/user';
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
  const { code } = router.query;
  const dispatch = useDispatch();

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

        if (window.Kakao) {
          window.Kakao.cleanup();
        }

        if (isRegister) {
          if (!NAME_REGX.test(data.name) || data.name.length === 0) {
            router.push('/signup/change-name');
          } else {
            dispatch(SET_BOTTOM_SHEET({ content: <WelcomeSheet /> }));
          }
        } else {
          router.replace('/');
        }
      } else {
        /* TODO: 아래 사항들 */
        // 비회원 -> 회원 장바구니 옮기기
        // 쿼리, 쿠키에 따라 페이지 리다이렉트 분기
      }
    } catch (error: any) {
      if (error.code === 2107) {
        dispatch(
          SET_ALERT({
            alertMessage: '전화번호가 등록되지 않은 카카오톡 계정입니다. ',
            onSubmit: () => {
              router.replace('/onboarding');
            },
          })
        );
      } else if (error.code === 2007) {
        dispatch(
          SET_ALERT({
            alertMessage: '이미 가입되어 있는 회원입니다.',
            onSubmit: () => {
              router.replace('/onboarding');
            },
          })
        );
      } else {
        dispatch(
          SET_ALERT({
            alertMessage: error.message,
            onSubmit: () => {
              router.replace('/onboarding');
            },
          })
        );
      }
    }
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

      if (code) {
        const { data } = await axios.post('https://kauth.kakao.com/oauth/token', queryString, {
          headers: kakaoHeader,
        });
        onSuccessKakao(data);
      }
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
