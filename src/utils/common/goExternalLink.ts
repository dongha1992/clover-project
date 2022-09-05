const goExternalLink = (url: string) => {
  const isCheckedApp = window.navigator.userAgent.includes('fco-clover-webview') ? true : false;
  if (!url) return false;
  const userAgent = window.navigator.userAgent;
  if (
    isCheckedApp &&
    window.ReactNativeWebView &&
    !userAgent.match('.*Android.*')
  ) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        cmd: 'webview-open-link',
        data: {
          url
        }
      })
    );
    return;
  };

  // 기종 따라 분기
  try {
    if (/windows phone/i.test(userAgent)) {
    window.open(url, '_blank');
    return 'Windows Phone';
    }
    //https://stackoverflow.com/questions/15193359/does-android-support-window-location-replace-or-any-equivalent
    if (/android/i.test(userAgent)) {
    window.open(url, '_blank');
    return 'Android';
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
    window.location.href = url;
    return 'iOS';
    }
  } catch (error) {
    console.error(error);
  };
  window.open(url, '_blank');
};

export default goExternalLink;
