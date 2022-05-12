import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SET_LOGIN_SUCCESS, SET_SIGNUP_USER, SET_USER_AUTH } from '@store/user';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Obj } from '@model/index';
import { NAME_REGX } from '@constants/regex';

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
      const data = {
        accessToken: authObj.access_token,
        tokenType: authObj.token_type,
      };

      // const result = await axios.post(`${process.env.KAKO_API_URL}/user/v1/signin-kakao`, data);
      const result = await axios.post('https://clover-dev.freshcode.me/user/v1/signin-kakao', data);
      console.log(result, 'AFTER SUCCESS');
      let { tel, nickname, newsletterEmail, newsletterPush, newsletterSms, name, isSignup, gender, email, birth } =
        result.data.user;

      if (!!isSignup && isSignup) {
        tel = result.data.user.tel.split('');
        tel.splice(0, 2, '8', '2');
        tel = tel.join('');
      }

      const userInfo = {
        name,
        tel,
        email,
        birthDate: birth,
        nickName: nickname,
        marketingEmailReceived: newsletterEmail,
        marketingSmsReceived: newsletterSms,
        gender: gender ? gender.toUpperCase() : null,
      };

      if (!NAME_REGX.test(result.data.user.name) || result.data.user.name.length === 0) {
        dispatch(
          SET_SIGNUP_USER({
            ...userInfo,
          })
        );
        router.push('/signup/change-name');
        return;
      }

      if (window.Kakao) {
        window.Kakao.cleanup();
      }

      dispatch(SET_USER_AUTH({ accessToken: result.data.user.auth }));
      dispatch(SET_LOGIN_SUCCESS(true));
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
        console.log(data, '@@@@');
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
