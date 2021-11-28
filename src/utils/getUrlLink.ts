export default function getUrlLink(e: any) {
  e.preventDefault();
  const url = window.location.href;

  if (window.navigator.clipboard === undefined) {
    alert('지원하지 않습니다.');
    return;
  }
  const clipboard = window.navigator.clipboard;
  clipboard.writeText(url).then(() => {
    alert('링크가 복사되었습니다.');
  });
}
