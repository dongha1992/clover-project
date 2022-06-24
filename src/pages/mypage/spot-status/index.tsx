import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SPOT_STATUS } from '@constants/spot';
import { SpotStatusList, SpotWishList } from '@components/Pages/Mypage/Spot';
import { fixedTab, homePadding, theme } from '@styles/theme';
import router from 'next/router';
import { IParamsSpots, IGetDestinationsRequest, IGetRegistrationStatus } from '@model/index';
import { useQuery } from 'react-query';
import { getSpotsWishList } from '@api/spot';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { deleteSpotLike, getSpotsRegistrationStatus, getSpotInfo } from '@api/spot';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { commonSelector } from '@store/common';

const SpotStatusPage = () => {
  const router = useRouter();
  const { spotsPosition } = useSelector(spotSelector);
  const { isScroll } = useSelector(commonSelector);
  const [selectedTab, setSelectedTab] = useState<string>('/spot/status/list');
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [statusList, setStatusList] = useState<IGetRegistrationStatus[]>([]);
  const latLen = spotsPosition.latitude?.length > 0;
  const lonLen = spotsPosition.longitude?.length > 0;

  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
        // 페이지 끝에 도달하면 page 파라미터 값에 +1 주고, 데이터 받아온다.
        setPage(page + 1);
      }
    };
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusList.length > 0]);

  useEffect(()=> {
    getSpotRegistrationList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // 찜한 스팟 api
  const { data: wishList } = useQuery(
    ['spotList'],
    async () => {
      const params: IParamsSpots = {
        latitude: latLen ? Number(spotsPosition.latitude) : 37.50101118367814,
        longitude: lonLen ? Number(spotsPosition.longitude) : 127.03525895821902,
        size: 10,
        page: 1,
      };
      const response = await getSpotsWishList(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 스팟 정보 조회 api
  const { data: getInfo } = useQuery(
    ['spotList'],
    async () => {
      const response = await getSpotInfo();
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );


  // 스팟 신청 목록 조회 api
  const getSpotRegistrationList = async() => {
    const params: IGetDestinationsRequest = {
      page: page,
      size: 10,
    };
    try {
      const { data } = await getSpotsRegistrationStatus(params);
      const list = data.data.spotRegistrations;
      const lastPage = data.data.pagination.totalPage;
      setStatusList((prevList) => [...prevList, ...list]);
      setIsLastPage(page === lastPage);
    } catch(e) {
      console.error(e);
    }
  };

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

  const goToSpotRegister = () => {
    router.push('/spot/join');
  };

  const goToSpotMain = () => {
    router.push('/spot');
  };

  return (
    <Container>
      <FixedTab scroll={isScroll}>
        <TabList tabList={SPOT_STATUS} onClick={selectTabHandler} selectedTab={selectedTab} />
      </FixedTab>
      <ContentWrapper>
        {selectedTab === '/spot/status/list' ? (
          <>
          {
            statusList.length! > 0 ? (
              <SpotStatusListWrapper >
                {statusList?.map((item, idx) => {
                  return (
                      <SpotStatusList item={item} key={idx} getInfo={getInfo} />
                  )
                })}
              </SpotStatusListWrapper>
            ) : (
              <SpotListEmptyScreen>
                <EmptyWrapper>
                  <TextB2R margin="0 0 24px 0" color={theme.greyScale65}>신청 중인 프코스팟이 없어요 😭 </TextB2R>
                  <Button margin="0 0 16px 0" backgroundColor={theme.white} color={theme.black} border onClick={goToSpotRegister}>
                    프코스팟 신청하기
                  </Button>
                </EmptyWrapper>
              </SpotListEmptyScreen>
            )
          }
          </>
        ) : (
          <>
          {
            wishList?.spots.length! > 0 ? (
              <SpotWishListWrapper>
                {wishList?.spots.map((item, idx) => {
                  return <SpotWishList key={idx} items={item} onClick={handlerDislike} />;
                })}
              </SpotWishListWrapper>
  
            ) : (
              <SpotListEmptyScreen>
                <EmptyWrapper>
                  <TextB2R margin="0 0 24px 0" color={theme.greyScale65}>찜한 프코스팟이 없어요 😭 </TextB2R>
                  <Button margin="0 0 16px 0" backgroundColor={theme.white} color={theme.black} border onClick={goToSpotMain}>
                    내 주변 프코스팟 보러가기
                  </Button>
                </EmptyWrapper>
              </SpotListEmptyScreen>
            )
          }
          </>
        )}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div``;

const ContentWrapper = styled.div`
  ${homePadding};
`;

const FixedTab = styled.div<{scroll: boolean}>`
  ${fixedTab};

  ${({scroll}) => {
    if (scroll) {
      return css `
        box-shadow: -1px 9px 16px -4px rgb(0 0 0 / 25%);
      `;
    }
  }}
`;

const SpotStatusListWrapper = styled.section`
  width: 100%;
  padding-top: 50px;
`

const SpotWishListWrapper = styled.section`
  width: 100%;
  padding-top: 72px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SpotListEmptyScreen = styled.section`
  width: 100%;
  height: 50vh;
  padding-top: 56px;
  position: relative;
`;

const EmptyWrapper = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
`;

export default React.memo(SpotStatusPage);
