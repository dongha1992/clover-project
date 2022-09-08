import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import { IGetNoti } from '@model/index';
import { NoNotiBox, NotiItem, NotiList, NOTI_MAP, TextBox } from '@pages/mypage/noti';
import { useInfiniteNotis } from '@queries/notification';
import { SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import { useRef } from 'react';

interface IProps {
  parentRef: any;
  postNotiChek: any;
}

const NotiOrder = ({ parentRef, postNotiChek }: IProps) => {
  const childRef = useRef<any>();

  const { data, fetchNextPage, isFetching } = useInfiniteNotis({
    key: ['notis', 'order'],
    size: 10,
    type: 'ORDER',
  });

  useIntersectionObserver({
    fetchNextPage,
    totalPage: data?.pages[0].totalPage!,
    currentPage: data?.pages.length!,
    childRef,
    parentRef,
    isFetching,
  });

  return (
    <>
      {data?.pages[0]?.result.length !== 0 ? (
        data?.pages?.map((page: any, index) => (
          <NotiList key={index}>
            {page.result?.map((item: IGetNoti, index: number) => (
              <NotiItem
                className={`${item.checked ? '' : 'on'}`}
                key={index}
                onClick={() => {
                  postNotiChek(item.id);
                }}
              >
                <TextBox>
                  <SVGIcon name={NOTI_MAP[item.type]} />
                  <TextH5B margin="0 0 4px">{item.title}</TextH5B>
                  <TextB2R margin="0 0 8px" color="#717171">
                    {item.content}
                  </TextB2R>
                  <TextB3R color="#717171">
                    {dayjs(item.createdAt).format('M')}월 {dayjs(item.createdAt).format('D')}일
                  </TextB3R>
                </TextBox>
              </NotiItem>
            ))}
          </NotiList>
        ))
      ) : (
        <NoNotiBox>
          <TextB2R>아직 도착한 알림이 없어요. 😭</TextB2R>
        </NoNotiBox>
      )}
      <div ref={childRef}></div>
    </>
  );
};
export default NotiOrder;
