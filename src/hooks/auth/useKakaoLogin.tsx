import { userProfile } from '@api/user';
import { userLoginApi } from '@api/authentication';
import { NAME_REGX } from '@constants/regex';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_LOGIN_TYPE } from '@store/common';
import { SET_LOGIN_SUCCESS, SET_USER, SET_USER_AUTH } from '@store/user';
import { useDispatch } from 'react-redux';
import { WelcomeSheet } from '@components/BottomSheet/WelcomeSheet';
import { useRouter } from 'next/router';
import { SET_ALERT } from '@store/alert';
import { IAuthObj } from '@model/index';

const useKakaoLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onKaKao = async (authObj: IAuthObj) => {
    window.Kakao.Auth.setAccessToken(authObj.access_token);
    try {
      const result = await userLoginApi({
        loginType: 'KAKAO',
        accessToken: `bearer ${authObj.access_token}`,
      });

      window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-msg', data: result }));

      if (result.data.code === 200) {
        const userTokenObj = result.data.data;
        const isRegister = result?.data?.data?.isJoin;

        dispatch(SET_USER_AUTH(userTokenObj));
        dispatch(SET_LOGIN_SUCCESS(true));
        dispatch(SET_LOGIN_TYPE('KAKAO'));

        const { data } = await userProfile().then((res) => {
          return res?.data;
        });
        console.log('userProfile', data);

        dispatch(SET_USER(data));

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

  return onKaKao;
};
export default useKakaoLogin;
