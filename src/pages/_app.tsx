import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode, useEffect, useRef } from 'react';
import GlobalStyle from '@styles/GlobalStyle';
import { theme } from '@styles/theme';
import { getMediaQuery } from '@utils/common';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { wrapper } from '@store/index';
import { SET_IS_APP, SET_IS_MOBILE } from '@store/common';
import MobileDetect from 'mobile-detect';
import { ReactQueryDevtools } from 'react-query/devtools';
import Script from 'next/script';
import { NAME_REGX } from '@constants/regex';
import { useRouter } from 'next/router';
import { HistoryProvider } from '@context/History';

// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { INIT_USER, SET_LOGIN_SUCCESS, SET_USER, userForm } from '@store/user';
import { userProfile } from '@api/user';
import { getCookie } from '@utils/common/cookie';
import useWebviewListener from '@hooks/useWebviewListener';
import { NextPage } from 'next';
import DefaultLayout from '@components/Layout/Default';
import { INIT_ALERT } from '@store/alert';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { hideImageViewer } from '@store/imageViewer';
import * as ga from 'src/lib/ga';
import { useToast } from '@hooks/useToast';

declare global {
  interface Window {
    Kakao: any;
    nicepaySubmit: any;
    nicepayClose: any;
    nicepayMobileStart: any;
    kakao: any;
    gtag: any;
    ChannelIO: any;
  }
}

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useRef<QueryClient>();

  /* 스크린 사이즈 체크 전역 처리 */
  /*TODO: 이거 말고 다른 걸로..? */
  const isWithContentsSection = useMediaQuery('(min-width:1024px)');
  const isMobile = useMediaQuery('(max-width:512px)');

  // const { showToast, hideToast } = useToast();
  const store: any = useStore();
  const isAutoLogin = getCookie({ name: 'autoL' });
  const { hideToast } = useToast();
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  useWebviewListener();

  if (!queryClient.current) {
    queryClient.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  }

  useEffect(() => {
    if (sessionStorage.getItem('selectedDay')) {
      sessionStorage.removeItem('selectedDay');
    }
    router.events.on('routeChangeStart', routerEvent);

    return () => router.events.off('routeChangeStart', routerEvent);
  }, []);

  const routerEvent = () => {
    if (store.getState().alert) dispatch(INIT_ALERT());
    if (store.getState().bottomSheet.content) dispatch(INIT_BOTTOM_SHEET());
    if (store.getState().imageViewer.images.length !== 0) dispatch(hideImageViewer());
    if (store.getState().toast) hideToast();
  };

  const authCheck = async () => {
    try {
      const token = await getCookie({ name: 'acstk' });
      // accesstoken이 있을때 로그인
      if (token) {
        const { data } = await userProfile();
        if (data.code === 200) {
          data.data.nickname ??= data.data.name;
          data.data.nickname ||= data.data.name;
          dispatch(SET_USER(data.data));
          dispatch(SET_LOGIN_SUCCESS(true));
          if (!NAME_REGX.test(data.data.name)) {
            router.push('/signup/change-name');
            return;
          }
        }
      } else {
        // 토큰이 없으면 먼저 유저 정보 초기화
        dispatch(INIT_USER());
        // accesstoken이 없고 자동로그인을 체크했을때 로그인
        if (isAutoLogin === 'Y') {
          const { data } = await userProfile();
          if (data.code === 200) {
            data.data.nickname ??= data.data.name;
            data.data.nickname ||= data.data.name;
            dispatch(SET_USER(data.data));
            dispatch(SET_LOGIN_SUCCESS(true));
            if (!NAME_REGX.test(data.data.name)) {
              router.push('/signup/change-name');
              return;
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const initKakao = () => {
    try {
      if (!window.Kakao.isInitialized()) {
        if (typeof window !== undefined) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.navigator.userAgent.includes('fco-clover-webview')
      ? dispatch(SET_IS_APP(true))
      : dispatch(SET_IS_APP(false));
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      const md = new MobileDetect(window.navigator.userAgent);
      let mobile = !!md.mobile();
      dispatch(SET_IS_MOBILE(mobile));
    }
    authCheck();
    initKakao();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
      document?.getElementById('right')?.scrollTo(0, 0);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>프레시코드</title>
      </Head>
      <>
        <Script type="text/javascript" src="//developers.band.us/js/share/band-button.js?v=13062022"></Script>
        <Script
          type="text/javascript"
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        ></Script>
        <Script
          type="text/javascript"
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
          strategy="beforeInteractive"
        ></Script>
        <Script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services,clusterer`}
          strategy="beforeInteractive"
        ></Script>
        <Script src="https://web.nicepay.co.kr/v3/webstd/js/nicepay-2.0.js" type="text/javascript"></Script>
        <Script id="nicePay">
          {`  // 결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
            const nicepaySubmit = () => {
                document.payForm.submit()
            }

            const nicepayClose = () => {
                let payForm = document.getElementById('payForm');
                payForm.innerHTML = '';
                window.location.reload()
                alert('결제를 취소 하였습니다.');
                }

            const nicepayMobileStart = () => {
                document.payFormMobile.submit();
                }   
            `}
        </Script>

        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* 채널톡 */}
        <Script
          id="channelTalk"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function() {
            var w = window;
            if (w.ChannelIO) {
              return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
            }
            var ch = function() {
              ch.c(arguments);
            };
            ch.q = [];
            ch.c = function(args) {
              ch.q.push(args);
            };
            w.ChannelIO = ch;
            function l() {
              if (w.ChannelIOInitialized) {
                return;
              }
              w.ChannelIOInitialized = true;
              var s = document.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
              s.charset = 'UTF-8';
              var x = document.getElementsByTagName('script')[0];
              x.parentNode.insertBefore(s, x);
            }
            if (document.readyState === 'complete') {
              l();
            } else if (window.attachEvent) {
              window.attachEvent('onload', l);
            } else {
              window.addEventListener('DOMContentLoaded', l, false);
              window.addEventListener('load', l, false);
            }
          })();
          ChannelIO('boot', {
            "pluginKey": '${process.env.NEXT_PUBLIC_CHANNEL_IO_KEY}',
            'customLauncherSelector': '#custom-ch-btn',
            'hideChannelButtonOnBoot': ${true},
            'mobileMessengerMode': 'newTab',
          });
          `,
          }}
        />
      </>

      <QueryClientProvider client={queryClient.current}>
        <HistoryProvider>
          <ThemeProvider theme={{ ...theme, ...getMediaQuery, isWithContentsSection, isMobile }}>
            <GlobalStyle />
            <PersistGate persistor={store.__persistor}>
              <ReactQueryDevtools initialIsOpen={false} />
              {getLayout(<Component {...pageProps} />)}
            </PersistGate>
          </ThemeProvider>
        </HistoryProvider>
        <button id="custom-ch-btn" style={{ display: 'none' }}>
          문의하기
        </button>
        <form
          name="payForm"
          id="payForm"
          method="post"
          action=""
          acceptCharset="UTF-8"
          style={{ display: 'none' }}
        ></form>
        <form
          name="payFormMobile"
          id="payFormMobile"
          target="_self"
          method="post"
          action="https://web.nicepay.co.kr/v3/smart/smartPayment.jsp"
          acceptCharset="euc-kr"
          style={{ display: 'none' }}
        ></form>
      </QueryClientProvider>
    </>
  );
};

export default wrapper.withRedux(MyApp);
