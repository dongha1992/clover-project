import { TextB2R } from '@components/Shared/Text';
import { Obj } from '@model/index';
import { usePostNotiCheck } from '@queries/notification';
import { theme } from '@styles/theme';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import styled, { css } from 'styled-components';
import useScrollCheck from '@hooks/useScrollCheck';

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
  const isScroll = useScrollCheck();
  const queryClient = useQueryClient();
  const parentRef = useRef<any>();
  const [selected, setSelected] = useState('ALL');
  const [isData, setIsData] = useState<boolean>();
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
      <FilterWrapper scroll={isScroll}>
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
      {selected === 'ALL' && <NotiAll parentRef={parentRef} postNotiChek={postNotiChek} setIsData={setIsData} />}
      {selected === 'ORDER' && <NotiOrder parentRef={parentRef} postNotiChek={postNotiChek} setIsData={setIsData} />}
      {selected === 'SPOT' && <NotiSpot parentRef={parentRef} postNotiChek={postNotiChek} setIsData={setIsData} />}
      {selected === 'ACTIVITY' && (
        <NotiActivity parentRef={parentRef} postNotiChek={postNotiChek} setIsData={setIsData} />
      )}
      {selected === 'POINT' && <NotiPoint parentRef={parentRef} postNotiChek={postNotiChek} setIsData={setIsData} />}
      {selected === 'COUPON' && <NotiCoupon parentRef={parentRef} postNotiChek={postNotiChek} setIsData={setIsData} />}
      {selected === 'BENEFIT' && (
        <NotiBenefit parentRef={parentRef} postNotiChek={postNotiChek} setIsData={setIsData} />
      )}
      {!isData && (
        <NoNotiBox>
          <TextB2R>아직 도착한 알림이 없어요. 😭</TextB2R>
        </NoNotiBox>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 128px);
`;
const FilterWrapper = styled.article<{ scroll: boolean }>`
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
  ${({ scroll }) => {
    if (scroll) {
      return css`
        &::after{
          content: '';
          display: block;
          position: absolute;
          right: 0;
          left: 0px;
          bottom: -20px;
          height: 20px;
          background-size: 30px auto;
          background-image: url("data:image/svg+xml,%3Csvg width='45' height='30' viewBox='0 0 45 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='45' height='30' fill='url(%23paint0_linear_1899_3133)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_1899_3133' x1='22.5' y1='0' x2='22.5' y2='16.5' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-opacity='0.2'/%3E%3Cstop offset='0.135417' stop-opacity='0.1'/%3E%3Cstop offset='0.369792' stop-opacity='0.0326087'/%3E%3Cstop offset='0.581127' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A");
        }
      `;
    }
  }}

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
