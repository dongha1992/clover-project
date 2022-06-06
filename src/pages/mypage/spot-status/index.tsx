import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SPOT_STATUS } from '@constants/spot';
import { SpotStatusList, SpotWishList } from '@components/Pages/Mypage/Spot';
import { FixedTab, homePadding } from '@styles/theme';
import router from 'next/router';
import { IParamsSpots, IGetDestinationsRequest } from '@model/index';
import { useQuery } from 'react-query';
import { getSpotsWishList } from '@api/spot';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { deleteSpotLike, getSpotsRegistrationStatus } from '@api/spot';


const SpotStatusPage = () => {
  // TODO
  // 필요하다면 무한스크롤 페이지네이션 작업
  // 좋아요 버튼 활성화 작업
  const { spotsPosition } = useSelector(spotSelector);
  const [selectedTab, setSelectedTab] = useState('/spot/status/list');
  // const [page, setPage] = useState(1);
  const [items, setItems] = useState(false);

  const latLen = spotsPosition.latitude.length > 0;
  const lonLen = spotsPosition.longitude.length > 0;

  // 찜한 스팟 api
  const { data: wishList } = useQuery(
    ['spotList'],
    async () => {
      const params: IParamsSpots = {
        latitude: latLen ? Number(spotsPosition.latitude) : null,
        longitude: lonLen ? Number(spotsPosition.longitude) : null,
        size: 10,
        page: 1,
      };
      const response = await getSpotsWishList(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 스팟 현황 api 
  const { data: spotStatusList } = useQuery(
    ['statusList'],
    async () => {
      const params: IGetDestinationsRequest = {
        page: 1,
        size: 10,
      };
      const response = await getSpotsRegistrationStatus(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
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
          <SpotStatusList items={spotStatusList?.spotRegistrations!} />
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
