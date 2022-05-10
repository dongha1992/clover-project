import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SET_LOGIN_SUCCESS } from '@store/user';
import axios from 'axios';

const Oauth = () => {
  const dispatch = useDispatch();

  const onSuccessKakao = () => {};

  useEffect(() => {
    window.Kakao.Auth.login({
      success: async (res: any) => {
        const data = {
          accessToken: res.access_token,
          tokenType: res.token_type,
        };

        const result = await axios.post(`${process.env.KAKO_API_URL}/user/v1/signin-kakao`, data);
        if (window.Kakao) {
          window.Kakao.cleanup();
        }
        dispatch(SET_LOGIN_SUCCESS(true));
      },
      fail: async (res: any) => {
        alert(`${res.error}-${res.error_error_description}`);
      },
    });
  }, []);

  return <div></div>;
};

export default Oauth;
