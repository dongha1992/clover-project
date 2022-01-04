const goToShare = ({ e, url, title, description }: any) => {
  if (navigator.share) {
    navigator
      .share({
        title,
        description,
        url,
      })
      .then(() => {
        alert('공유가 완료되었습니다.');
      })
      .catch(console.error);
  } else {
    return 'null';
  }
};

export default goToShare;
