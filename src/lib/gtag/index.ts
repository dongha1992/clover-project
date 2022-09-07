// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => { // 페이지 뷰 기록
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  })
};

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const setEvent = ({ action, category, label, value }: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
};
