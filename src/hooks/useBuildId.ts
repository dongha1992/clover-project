import React from 'react';

const useBuildId = () => {
  const shouldReload = React.useCallback((): boolean => {
    if (process.env.NODE_ENV != 'production') {
      return false;
    }

    const buildId = JSON.parse(document?.querySelector('#__NEXT_DATA__')?.textContent!).buildId;

    const request = new XMLHttpRequest();
    request.open('HEAD', `/_next/static/${buildId}/_buildManifest.js`, false);
    request.setRequestHeader('Pragma', 'no-cache');
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
    request.send(null);

    return request.status === 404;
  }, []);

  return {
    shouldReload,
  };
};

export default useBuildId;
