import React, { ReactElement, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { homePadding } from '@styles/theme';
import { theme, FlexBetween, FlexEnd } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B, TextH2B, TextB2R } from '@components/Shared/Text';
import { 
  SpotList, 
  SpotRecommendList, 
  SpotRecentPickupList, 
  SpotSearchMapMain 
} from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { getSpotSearchRecommend, getSpotEvent } from '@api/spot';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { destinationForm } from '@store/destination';
import { 
  spotSelector,
  SET_SEARCH_KEYWORD,
  SET_SERACH_MAP_SPOT,
  SET_SPOT_MAP_SWITCH,
} from '@store/spot';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { SpotSearchKeyword } from '@components/Pages/Spot';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { 
    spotsPosition, 
    isMapSwitch,
  } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const userLocationLen = !!userLocation.emdNm?.length;

  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : 37.50101118367814;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : 127.03525895821902;

  useEffect(()=> {
    dispatch(SET_SEARCH_KEYWORD(''));
    dispatch(SET_SPOT_MAP_SWITCH(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스팟 검색 - 추천 스팟 api
  const { data: spotRecommend, isLoading: isLoadingRecomand } = useQuery(
    ['spotRecommendList'],
    async () => {
      const params: IParamsSpots = {
        latitude: latitude,
        longitude: longitude,
        size: 3,
      };
      const response = await getSpotSearchRecommend(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );
  
  // 스팟 검색 - 이벤트 스팟 api
  const { data: eventSpot, isLoading: isLoadingEventSpot } = useQuery(
    ['spotEvetnList'],
    async () => {
      const params: IParamsSpots = {
        latitude: latitude,
        longitude: longitude,
        size: 6,
      };
      const response = await getSpotEvent(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 최근 픽업 이력 조회 api
  const { data: recentPickedSpotList, isLoading: isLoadingPickup } = useQuery<IDestinationsResponse[]>(
    'getDestinationList',
    async () => {
      const params = {
        page: 1,
        size: 10,
        delivery: 'SPOT',
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getDestinationsApi(params);
      const totalList = data.data.destinations;
      return totalList;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 추천스팟 + 이벤트 스팟 
  const spotsArr = spotRecommend?.spots.concat(eventSpot?.spots!);

  useEffect(()=> {
    dispatch(SET_SERACH_MAP_SPOT(spotsArr!));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[eventSpot]);

  const goToSpotSearch = () => {
    router.push('/spot/search/main');
  };


  const handlerSearchKeyword = (value: string) => {
    dispatch(SET_SEARCH_KEYWORD(value));
    router.push('/spot/search/main');
  };

  if (isLoadingRecomand && isLoadingEventSpot && isLoadingPickup) {
    return <div>로딩</div>;
  };

  return (
    <Container>
      {
        isMapSwitch ? (
          <SpotSearchMapMain />
        ) : (
          <>
            <SearchBarWrapper onClick={goToSpotSearch}>
              <TextInputButton>
                <div className='sgv'>
                  <SVGIcon name="searchIcon" />
                </div>
                <Text>도로명, 건물명 또는 지번으로 검색</Text>
              </TextInputButton>
            </SearchBarWrapper>
            <FlexEnd padding="16px 24px 0 0">
              <SVGIcon name="locationBlack" />
              <TextH6B margin="0 0 0 2px" padding="3px 0 0 0">
                현 위치로 설정하기
              </TextH6B>
            </FlexEnd>
            <KeyWordWrapper>
              <SpotSearchKeyword onChange={handlerSearchKeyword} />
            </KeyWordWrapper>
            {
            // 스팟 검색 메인 - 검색바 포커싱 x
              ((spotRecommend?.spots.length! > 0) && (eventSpot?.spots.length! > 0)) ? (
                // 스팟 검색 메인 - 추천, 이벤트 스팟이 있는 경우 노출
                <>
                {/* 추천스팟 */}
                  <SpotRecommendWrapper>
                    <FlexBetween margin="0 0 24px 0">
                      <TextH2B>{spotRecommend?.title}</TextH2B>
                      {
                        // 사용자 위치 설정 했을 경우 노출
                        userLocationLen && <TextB3R color={theme.greyScale65}>500m이내 프코스팟</TextB3R>
                      }
                    </FlexBetween>
                    {spotRecommend?.spots.map((item: any, index: number) => {
                      return <SpotRecommendList item={item} key={index} />;
                    })}
                  </SpotRecommendWrapper>
                  {/* 이벤트 중인 스팟 */}
                  <BottomContentWrapper>
                    <Row />
                    <TextH2B padding="24px 24px 24px 24px">{eventSpot?.title}</TextH2B>
                    <EventSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={20} speed={500}>
                      {eventSpot?.spots.map((list, idx) => {
                        return (
                          <SwiperSlide className="swiper-slide" key={idx}>
                            <SpotList list={list} type="event" isSearch />
                          </SwiperSlide>
                        );
                      })}
                    </EventSlider>
                  </BottomContentWrapper>
                </>
              ) : (
                // 스팟 검색 메인 - 추천, 이벤트 스팟 둘다 없는 경우, 최근 픽업 이력 노출
                <>
                {
                  recentPickedSpotList?.length! > 0 ? (
                    // 최근 픽업 이력이 있는 경우, 픽업 이력 노출
                    <DefaultSearchContainer>
                      <RecentPickWrapper>
                        <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
                        {recentPickedSpotList?.map((item: any, index) => (
                          // 스팟 최근 픽업 이력 리스트
                          <SpotRecentPickupList item={item} key={index} hasCart={true} />
                        ))}
                      </RecentPickWrapper>
                    </DefaultSearchContainer>
                  ) : (
                    // 최근 픽업 이력이 없는 경우, 안내 문구 노출
                    <DefaultSearchContainer empty>
                      <TextB2R color={theme.greyScale65} center>{'찾으시는 프코스팟을 검색해 보세요.\n(이용 가능 지역: 서울 및 경기도 일부)'}</TextB2R>
                    </DefaultSearchContainer>
                  )
                }
                </>
              )
            }
          </>
        )
      }
    </Container>
  );
};

const Container = styled.main``;

const SearchBarWrapper = styled.div`
  margin: 8px 24px 0 24px;
  position: relative;
  .removeSvg {
    position: absolute;
    right: 0;
    top: 0;
    margin: 15px 14px 0 0;
  }
`;

const TextInputButton = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${theme.greyScale15};
  outline: none;
  cursor: pointer;
  padding: 13px 48px;
  .sgv {
    position: absolute;
    left: 15px;
    top: 11px;
  }
`;

const Text = styled.div`
  color: ${theme.greyScale45};
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
`;

const KeyWordWrapper = styled.div`
  padding: 16px 24px 24px 24px;
`;

const SpotRecommendWrapper = styled.section`
  margin-bottom: 16px;
  ${homePadding};
`;

const RecentPickWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 16px;
  ${homePadding};
`;

const DefaultSearchContainer = styled.section<{empty?: boolean}>`
  ${({empty}) => {
    if(empty){
      return css`
        height: 32vh;
        display: flex;
        justify-content: center;
        align-items: end;
      `
    }
  }}
`;

const SearchResultContainer = styled.section`
  display: flex;
  flex-direction: column;
  ${homePadding}
`;

const EventSlider = styled(Swiper)`
  padding: 0 24px;
  .swiper-slide {
    width: 299px;
  }
`;

const Row = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.greyScale3};
`;

const BottomContentWrapper = styled.section`
  width: 100%;
  position: relative;
  bottom: 0px;
  right: 0px;
  background-color: ${theme.white};
`;

export default SpotSearchPage;
