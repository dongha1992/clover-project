const getUrlLink = (e: any, cb: any, customUrl?: string) => {
  e.preventDefault();
  const url = customUrl ? customUrl : window.location.href;

  if (window.navigator.clipboard === undefined) {
    alert('복사를 지원하지 않는 브라우저 입니다.');
    return;
  }

  const clipboard = window.navigator.clipboard;
  clipboard
    .writeText(url)
    .then(() => {
      cb();
    })
    .catch(() => {
      alert('다시 시도해주세요.');
    });
};

export default getUrlLink;
