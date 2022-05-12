import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SET_LOGIN_SUCCESS, SET_SIGNUP_USER, SET_USER_AUTH, SET_USER } from '@store/user';
import { SET_LOGIN_TYPE } from '@store/common';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Obj } from '@model/index';
import { NAME_REGX } from '@constants/regex';
import { userLoginApi, userProfile } from '@api/user';

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
    console.log(authObj, window.Kakao, 'authObj');
    window.Kakao.Auth.setAccessToken(authObj.access_token);

    try {
      const result = await userLoginApi({
        loginType: 'KAKAO',
        accessToken: `${authObj.access_token}`,
      });

      console.log(result, 'AFTER SUCCESS');

      if (result.data.code === 200) {
        const userTokenObj = result.data.data;

        dispatch(SET_USER_AUTH(userTokenObj));
        dispatch(SET_LOGIN_SUCCESS(true));
        dispatch(SET_LOGIN_TYPE('KAKAO'));

        const userInfo = await userProfile().then((res) => {
          return res?.data;
        });

        console.log(userInfo, 'userInfo');

        if (!NAME_REGX.test(userInfo.name) || userInfo.name.length === 0) {
          dispatch(
            SET_SIGNUP_USER({
              ...userInfo,
            })
          );
          router.push('/signup/change-name');
          return;
        }
        dispatch(SET_USER(userInfo.data));
      }

      if (window.Kakao) {
        window.Kakao.cleanup();
      }

      router.push('/mypage');

      // 비회원 -> 회원 장바구니 옮기기

      // 쿼리, 쿠키에 따라 페이지 리다이렉트 분기
    } catch (e) {
      console.log(e);
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
    initKakaoAuth();
  }, [code]);

  return <div></div>;
};

export default Oauth;
