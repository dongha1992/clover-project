import { putDeviceApi } from '@api/device';
import { useEffect } from 'react';
import { useAppleLogin, useKakaoLogin } from './auth';

const useWebviewListener = () => {
  const onKaKao = useKakaoLogin();
  const onApple = useAppleLogin();

  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.addEventListener('message', webviewListener);
    }
    return () => {
      window.removeEventListener('message', webviewListener);
    };
  }, []);

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
      case 'rn-device-register':
        putDeviceApi(data);
        break;

      default:
        break;
    }
  };
};

export default useWebviewListener;
