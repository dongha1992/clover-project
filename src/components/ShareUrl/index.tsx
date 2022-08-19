import { SET_ALERT } from '@store/alert';
import { INIT_BOTTOM_SHEET, SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';
import { useDispatch } from 'react-redux';
import { useToast } from '@hooks/useToast';
import { useEffect } from 'react';

interface IShareUrl {
  linkUrl: string
  title: string
  className?: string
  children: JSX.Element | string
}

const ShareUrl = ({ linkUrl, title, className, children }: IShareUrl) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      dispatch(INIT_BOTTOM_SHEET());
    };
  });

  const shareHandler = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: linkUrl });
        showToast({ message: '공유가 완료되었습니다.'});
      } catch (e) {
        dispatch(
          SET_ALERT({
            alertMessage: '링크 공유에 실패 하였습니다.',
          })
        );
      }
    } else {
      dispatch(INIT_BOTTOM_SHEET());
      dispatch(SET_BOTTOM_SHEET({ content: <ShareSheet shareUrl={linkUrl} /> }));
    }
  }

  return (
    <div onClick={shareHandler} className={className}>
      {children}
    </div>
  );
}

export default ShareUrl;