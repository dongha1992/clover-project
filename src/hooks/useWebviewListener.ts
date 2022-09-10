import { putDeviceApi } from '@api/device';
import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { useAppleLogin, useKakaoLogin } from './auth';

const useWebviewListener = () => {
  const store: any = useStore();
  const onKaKao = useKakaoLogin();
  const onApple = useAppleLogin();

  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-message-eventListener-on', data: true }));
      if (window.navigator.userAgent.match('ios')) {
        window.addEventListener('message', webviewListener);
      } else {
        document.addEventListener('message', webviewListener);
      }
    }
    return () => {
      if (window.ReactNativeWebView) {
        window.removeEventListener('message', webviewListener);
        document.removeEventListener('message', webviewListener);
      }
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
      case 'rn-login-check':
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ cmd: 'webview-login-check', data: !!store.getState().user.me })
        );
        break;

      default:
        break;
    }
  };
};

export default useWebviewListener;
