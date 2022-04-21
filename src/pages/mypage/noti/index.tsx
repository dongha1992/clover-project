import { TabList } from '@components/Shared/TabList';
import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface INoti {
  title?: string;
  content?: string;
  date?: string;
  type?: string;
  check?: boolean;
}

const NotiPage = () => {
  const [selected, setSelected] = useState('all');
  const [filterList, setFilterList] = useState([
    {
      id: 1,
      name: '전체',
      type: 'all',
      selected: true,
    },
    {
      id: 2,
      name: '일반 주문/배송',
      type: 'delivery',
      selected: false,
    },
    {
      id: 3,
      name: '구독 주문/배송',
      type: 'subscription',
      selected: false,
    },
    {
      id: 4,
      name: '쿠폰',
      type: 'coupon',
      selected: false,
    },
    {
      id: 5,
      name: '포인트',
      type: 'point',
      selected: false,
    },
    {
      id: 6,
      name: '후기',
      type: 'review',
      selected: false,
    },
    {
      id: 7,
      name: '이벤트',
      type: 'event',
      selected: false,
    },
  ]);

  const [oriNotiList, setOriNotiList] = useState([
    {
      title: '상품이 도착했어요',
      content: '닭가슴살 아몬드 샐러드 외 4개 상품을 배송완료 했어요!',
      date: '12월 13일',
      type: 'delivery',
      check: false,
    },
    {
      title: '상품을 배송 중이에요',
      content: '닭가슴살 아몬드 샐러드 외 4개 상품에 만족하셨다면 후기를 남겨주세요. (3월 1일까지)',
      date: '12월 13일',
      type: 'subscription',
      check: false,
    },
    {
      title: '후기 작성해주세요',
      content: '닭가슴살 아몬드 샐러드 외 4개 상품에 만족하셨다면 후기를 남겨주세요. (3월 1일까지)',
      date: '12월 13일',
      type: 'review',
      check: true,
    },
    {
      title: '쿠폰 만료이 곧 만료돼요',
      content: '정기구독 전용 50%할인 쿠폰이 내일 만료될 예정이에요. 좋은 기회 놓치지 말아요!',
      date: '12월 13일',
      type: 'coupon',
      check: true,
    },
    {
      title: '포인트가 적립됐어요',
      content: '친구 초대 포인트로 5,000P가 적립됐어요.',
      date: '12월 13일',
      type: 'point',
      check: true,
    },
    {
      title: '프코 편의점엔 럭키 스낵박스부터',
      content: '프코 편의점엔 럭키 스낵박스부터! 2+1증정, 최대 20% 할인까지',
      date: '12월 13일',
      type: 'event',
      check: true,
    },
  ]);
  const [notiList, setNotiList] = useState<INoti[]>();

  useEffect(() => {
    if (selected === 'all') {
      setNotiList(oriNotiList);
    } else {
      const notiData = oriNotiList.filter((item) => item.type === selected);
      setNotiList(notiData);
    }
  }, [filterList]);

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
    <Container>
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
              <TextB2R whiteSpace="nowrap">{elem.name}</TextB2R>
            </FilterItem>
          ))}
        </FilterList>
      </FilterWrapper>
      <NotiList>
        {notiList?.map((item: any, index: number) => (
          <NotiItem className={`${item.check ? '' : 'on'}`} key={index}>
            <TextBox>
              <SVGIcon name={item.type} />
              <TextH5B margin="0 0 4px">{item.title}</TextH5B>
              <TextB2R margin="0 0 8px" color="#717171">
                {item.content}
              </TextB2R>
              <TextB3R color="#717171">{item.date}</TextB3R>
            </TextBox>
          </NotiItem>
        ))}
      </NotiList>
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
const NotiList = styled.ul`
  height: calc(100vh - 130px);
  overflow-y: scroll;
`;
const NotiItem = styled.li`
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
const TextBox = styled.div`
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
