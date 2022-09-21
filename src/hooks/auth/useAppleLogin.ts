import { getAppleTokenApi, userProfile } from '@api/user';
import { userLoginApi } from '@api/authentication';
import { SET_LOGIN_TYPE } from '@store/common';
import { SET_LOGIN_SUCCESS, SET_SIGNUP_USER, SET_USER, SET_USER_AUTH } from '@store/user';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { useRouter } from 'next/router';

const useAppleLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { recommendCode } = router.query;
  const onApple = async (appleToken: string) => {
    try {
      recommendCode && sessionStorage.setItem('recommendCode', recommendCode as string);
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
          recommendCode ? router.replace('/mypage/friend') : router.push('/');
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
        console.log(error.mesaage);
      }
    }
  };
  return onApple;
};
export default useAppleLogin;
