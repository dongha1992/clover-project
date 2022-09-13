// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => { // 페이지 뷰 기록
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  })
};

export const setEvent = ({ action, params }: any) => {
  window.gtag('event', action, params)
};
