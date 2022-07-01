const getUrlLink = (e: any, cb: any) => {
  e.preventDefault();
  const url = window.location.href;

  if (window.navigator.clipboard === undefined) {
    alert('지원하지 않습니다.');
    return;
  }
  const clipboard = window.navigator.clipboard;
  clipboard.writeText(url).then(() => {
    cb();
  });
};

export default getUrlLink;
