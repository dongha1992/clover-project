import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SPOT_STATUS } from '@constants/spot';
import { SpotStatusList, SpotWishList } from '@components/Pages/Mypage/Spot';
import { FixedTab, homePadding } from '@styles/theme';
import router from 'next/router';
import { IParamsSpots } from '@model/index';
import { useQuery } from 'react-query';
import { getSpotsWishList } from '@api/spot';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { deleteSpotLike } from '@api/spot';

const STATUS_LIST = [
  {
    id: 1,
    status: '작성중',
    tag: '프라이빗',
    storeName: '유니트아이엔씨',
    address: '서울 성동구 왕십리로 115 10층',
    btn: '이어서 작성하기',
    number: null,
  },
  {
    id: 2,
    status: '검토중',
    tag: '프라이빗',
    storeName: '헤이그라운드 서울숲',
    address: '서울 성동구 왕십리로 115 10층',
    btn: null,
    number: null,
  },
  {
    id: 3,
    status: '트라이얼 진행 중',
    tag: '프라이빗',
    storeName: '라이언게임즈',
    address: '서울 성동구 왕십리로 115 10층',
    btn: '오픈 참여 공유하고 포인트 받기',
    number: 2,
  },
  {
    id: 4,
    status: '트라이얼 진행 중',
    tag: '프라이빗',
    storeName: '제이엔케이 (전자조합회관빌딩)',
    address: '서울 성동구 왕십리로 115 10층',
    btn: '오픈 참여 공유하기',
    number: 2,
  },
  {
    id: 5,
    status: '모집중',
    tag: '단골가게',
    storeName: '파니모들카페',
    address: '서울 성동구 왕십리로 115 10층',
    btn: null,
    number: null,
  },
  {
    id: 6,
    status: '오픈완료',
    tag: '프라이빗',
    storeName: '아이엔티부동산중걔법인',
    address: '서울 성동구 왕십리로 115 10층',
    btn: null,
    number: null,
  },
  {
    id: 7,
    status: '오픈 미진행',
    tag: '프라이빗',
    storeName: '유니트아이엔씨',
    address: '서울 성동구 왕십리로 115 10층',
    btn: null,
    number: null,
  },
];

const SpotStatusPage = () => {
  // TODO
  // 필요하다면 무한스크롤 페이지네이션 작업
  // 좋아요 버튼 활성화 작업
  const { spotsPosition } = useSelector(spotSelector);
  const [selectedTab, setSelectedTab] = useState('/spot/status/list');
  // const [page, setPage] = useState(1);
  const [items, setItems] = useState(false);

  const { data: wishList } = useQuery(
    ['spotList'],
    async () => {
      const params: IParamsSpots = {
        latitude: spotsPosition ? spotsPosition.latitude : null,
        longitude: spotsPosition ? spotsPosition.longitude : null,
        size: 10,
        page: 1,
      };
      const response = await getSpotsWishList(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  const goToSpotStatusDetail = () => {
    router.push('/mypage/spot-status/detail');
  };

  const handlerDislike = async (e: any, id: number) => {
    e.stopPropagation();
    try {
      const { data } = await deleteSpotLike(id);
      if (data.code === 200) {
        setItems(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {}, [items]);

  return (
    <Container>
      <FixedTab>
        <TabList tabList={SPOT_STATUS} onClick={selectTabHandler} selectedTab={selectedTab} />
      </FixedTab>
      <ContentWrapper>
        {selectedTab === '/spot/status/list' ? (
          <SpotStatusList items={STATUS_LIST} onClick={goToSpotStatusDetail} />
        ) : (
          <SpotWishListWrapper>
            {wishList?.spots.map((item, idx) => {
              return <SpotWishList key={idx} items={item} onClick={handlerDislike} />;
            })}
          </SpotWishListWrapper>
        )}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div``;

const ContentWrapper = styled.section`
  ${homePadding};
`;

const SpotWishListWrapper = styled.div`
  width: 100%;
  padding-top: 72px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
export default SpotStatusPage;
