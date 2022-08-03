import { getAppleTokenApi, userProfile } from '@api/user';
import { userLoginApi } from '@api/authentication';
import { SET_LOGIN_TYPE } from '@store/common';
import { SET_LOGIN_SUCCESS, SET_SIGNUP_USER, SET_USER, SET_USER_AUTH } from '@store/user';
import router from 'next/router';
import { useDispatch } from 'react-redux';

const useAppleLogin = () => {
  const dispatch = useDispatch();
  const onApple = async (appleToken: string) => {
    const params = { appleToken };
    const { data } = await getAppleTokenApi({ params });
    if (data.data.availability) {
      localStorage.setItem('appleToken', appleToken);
      router.replace('/signup?isApple=true');
      dispatch(SET_SIGNUP_USER({ email: data.data.email }));
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
        router.push('/');
      }
    }
  };
  return onApple;
};
export default useAppleLogin;
