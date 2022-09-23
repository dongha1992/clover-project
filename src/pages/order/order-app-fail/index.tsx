import { useEffect } from 'react';

const OrderAppFailPage = () => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-payment-fail' }));

  return <></>;
};
export default OrderAppFailPage;
