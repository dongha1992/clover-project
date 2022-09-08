import { TextB2R } from '@components/Shared/Text';
import { Obj } from '@model/index';
import { usePostNotiCheck } from '@queries/notification';
import { theme } from '@styles/theme';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';

const NotiAll = dynamic(() => import('@components/Pages/Mypage/Noti/NotiAll'));
const NotiOrder = dynamic(() => import('@components/Pages/Mypage/Noti/NotiOrder'));
const NotiSpot = dynamic(() => import('@components/Pages/Mypage/Noti/NotiSpot'));
const NotiActivity = dynamic(() => import('@components/Pages/Mypage/Noti/NotiActivity'));
const NotiPoint = dynamic(() => import('@components/Pages/Mypage/Noti/NotiPoint'));
const NotiCoupon = dynamic(() => import('@components/Pages/Mypage/Noti/NotiCoupon'));
const NotiBenefit = dynamic(() => import('@components/Pages/Mypage/Noti/NotiBenefit'));

export const NOTI_MAP: Obj = {
  ORDER: 'delivery',
  SPOT: 'notiSpot',
  ACTIVITY: 'notiReview',
  POINT: 'notiPoint',
  COUPON: 'notiCoupon',
  BENEFIT: 'notiBenefit',
};

const NotiPage = () => {
  const queryClient = useQueryClient();
  const parentRef = useRef<any>();
  const [selected, setSelected] = useState('ALL');
  const [filterList, setFilterList] = useState([
    {
      id: 1,
      name: '전체',
      type: 'ALL',
      selected: true,
    },
    {
      id: 2,
      name: '주문·배송',
      type: 'ORDER',
      selected: false,
    },
    {
      id: 3,
      name: '프코스팟',
      type: 'SPOT',
      selected: false,
    },
    {
      id: 4,
      name: '활동',
      type: 'ACTIVITY',
      selected: false,
    },
    {
      id: 5,
      name: '포인트',
      type: 'POINT',
      selected: false,
    },
    {
      id: 6,
      name: '쿠폰',
      type: 'COUPON',
      selected: false,
    },
    {
      id: 7,
      name: '혜택',
      type: 'BENEFIT',
      selected: false,
    },
  ]);

  const { mutate: postNotiChek } = usePostNotiCheck(['notiCheck'], {
    onSuccess: () => {
      queryClient.invalidateQueries('notis');
    },
  });

  const filterHandler = (elem: any) => {
    setFilterList((prev) =>
      prev.map((item) => {
        item.selected = false;
        if (item.name === elem.name) {
          setSelected(item.type);
          item.selected = true;
        }
        return item;
      })
    );
  };

  return (
    <Container ref={parentRef}>
      <FilterWrapper>
        <FilterList>
          {filterList.map((elem) => (
            <FilterItem
              key={elem.id}
              className={`${elem.selected ? 'on' : ''}`}
              onClick={() => {
                filterHandler(elem);
              }}
            >
              <TextB2R whiteSpace="nowrap" color={elem.selected ? '#fff' : '#242424'}>
                {elem.name}
              </TextB2R>
            </FilterItem>
          ))}
        </FilterList>
      </FilterWrapper>
      {selected === 'ALL' && <NotiAll parentRef={parentRef} postNotiChek={postNotiChek} />}
      {selected === 'ORDER' && <NotiOrder parentRef={parentRef} postNotiChek={postNotiChek} />}
      {selected === 'SPOT' && <NotiSpot parentRef={parentRef} postNotiChek={postNotiChek} />}
      {selected === 'ACTIVITY' && <NotiActivity parentRef={parentRef} postNotiChek={postNotiChek} />}
      {selected === 'POINT' && <NotiPoint parentRef={parentRef} postNotiChek={postNotiChek} />}
      {selected === 'COUPON' && <NotiCoupon parentRef={parentRef} postNotiChek={postNotiChek} />}
      {selected === 'BENEFIT' && <NotiBenefit parentRef={parentRef} postNotiChek={postNotiChek} />}
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 128px);
`;
const FilterWrapper = styled.article`
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
`;
const FilterList = styled.ul`
  padding-top: 16px;
  padding-bottom: 18px;
  display: flex;
  overflow-x: scroll;
`;
const FilterItem = styled.li`
  border: 1px solid #242424;
  padding: 8px 16px;
  margin-right: 8px;
  border-radius: 40px;
  cursor: pointer;
  &.on {
    background-color: #242424;
    color: #fff;
    div {
      font-weight: bold;
    }
  }
  &:last-of-type {
    margin-right: 0;
  }
`;
export const NotiList = styled.ul`
  height: calc(100vh - 130px);
  overflow-y: scroll;
`;
export const NotiItem = styled.li`
  position: relative;
  border-bottom: 1px solid #fff;
  padding: 16px 24px;
  cursor: pointer;
  &.on {
    background-color: #f5fbf8;
  }
  &::after {
    content: '';
    position: absolute;
    width: calc(100% - 48px);
    height: 1px;
    background-color: #f2f2f2;
    left: calc(50%);
    bottom: -1px;
    transform: translateX(-50%);
  }
`;
export const NoNotiBox = styled.div`
  display: flex;
  height: calc(100vh - 130px);
  justify-content: center;
  align-items: center;
  div {
    color: ${theme.greyScale65};
  }
`;
export const TextBox = styled.div`
  position: relative;
  padding-left: 32px;
  > div {
    word-break: keep-all;
  }
  > svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default NotiPage;
