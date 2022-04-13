import React, { ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { SpotsSearchItem } from '@components/Pages/Spot';
import { SearchResult } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { theme, FlexBetween, FlexEnd } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B, TextH2B } from '@components/Shared/Text';
import { SpotList, SpotRecommendList } from '@components/Pages/Spot';
import SVGIcon from '@utils/SVGIcon';
import { getSpotSearchRecommend, getSpotEvent, getSpotSearch } from '@api/spot';
import { ISpots, ISpotsDetail } from '@model/index';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { spotSelector } from '@store/spot';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { destinationForm } from '@store/destination';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const { spotsPosition } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [spotRecommend, setSpotRecommend] = useState<ISpots>();
  const [searchResult, setSearchResult] = useState<ISpotsDetail[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const userLocationLen = !!userLocation.emdNm?.length;

  const router = useRouter();
  const { orderId } = router.query;

  const getSearchRecommendList = async () => {
    const params = {
      latitude: spotsPosition ? spotsPosition.latitude : null,
      longitude: spotsPosition ? spotsPosition.longitude : null,
      size: 3,
    };
    try {
      const { data } = await getSpotSearchRecommend(params);
      const items = data.data;
      setSpotRecommend(items);
    } catch (err) {
      console.error(err);
    }
  };

  const { data: eventSpotList } = useQuery(
    ['spotList'],
    async () => {
      const params: IParamsSpots = {
        latitude: spotsPosition ? spotsPosition.latitude : null,
        longitude: spotsPosition ? spotsPosition.longitude : null,
        size: 6,
      };
      const response = await getSpotEvent(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  /* TAYLER: 배송지목록 전체 조회에서 spot만 뽑음 */

  const { data: recentPickedSpotList, isLoading } = useQuery<IDestinationsResponse[]>(
    'getDestinationList',
    async () => {
      const params = {
        page: 1,
        size: 10,
      };
      const { data } = await getDestinationsApi(params);
      const totalList = data.data.destinations;
      return totalList.filter((item) => {
        return item.delivery === 'SPOT';
      });
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const changeInputHandler = () => {
    const inputText = inputRef.current?.value.length;

    if (!inputText) {
      setSearchResult([]);
      setIsSearched(false);
    }
  };

  // 스팟 검색 결과
  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;

    if (e.key === 'Enter') {
      if (inputRef.current) {
        let keyword = inputRef.current?.value;
        if (!keyword) {
          setSearchResult([]);
          return;
        }
        try {
          const params = {
            keyword,
            latitude: spotsPosition ? spotsPosition.latitude : Number(37.50101118367814),
            longitude: spotsPosition ? spotsPosition.longitude : Number(127.03525895821902),
          };
          const { data } = await getSpotSearch(params);
          const fetchData = data.data;

          // setSpotTest(fetchData);
          const filtered = fetchData?.spots?.filter((c) => {
            return c.name.replace(/ /g, '').indexOf(value) > -1;
          });

          setSearchResult(filtered);
          setIsSearched(true);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const goToOrder = useCallback(() => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <PickupSheet />,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSearchRecommendList();
  }, []);

  useEffect(() => {
    if (orderId) {
      setInputFocus(true);
    }
  }, [orderId]);

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        <TextInput
          inputType="text"
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          onFocus={() => {
            setInputFocus(true);
          }}
          ref={inputRef}
        />
      </Wrapper>
      {!inputFocus ? (
        <>
          <SpotRecommendWrapper>
            <FlexEnd padding="0 0 24px 0">
              <SVGIcon name="locationBlack" />
              <TextH6B margin="0 0 0 2px" padding="3px 0 0 0">
                현 위치로 설정하기
              </TextH6B>
            </FlexEnd>
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
          <BottomContentWrapper>
            <Row />
            <TextH2B padding="24px 24px 24px 24px">{eventSpotList?.title}</TextH2B>
            <EventSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={20} speed={500}>
              {eventSpotList?.spots.map((list, idx) => {
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
        <>
          {!isSearched ? (
            recentPickedSpotList?.length! > 0 ? (
              <DefaultSearchContainer>
                <RecentPickWrapper>
                  <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
                  {recentPickedSpotList?.map((item: any, index) => (
                    <SpotsSearchItem item={item} key={index} onClick={goToOrder} />
                  ))}
                </RecentPickWrapper>
              </DefaultSearchContainer>
            ) : (
              // 픽업 이력 없는 경우, 추천 스팟 노출
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
            )
          ) : (
            // 검색 결과
            <SearchResultContainer>
              <SearchResult searchResult={searchResult} isSpot onClick={goToOrder} orderId={orderId} />
            </SearchResultContainer>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.main``;

const Wrapper = styled.div`
  padding: 8px 24px;
`;

const SpotRecommendWrapper = styled.section`
  margin-top: 24px;
  margin-bottom: 16px;
  ${homePadding};
`;

const RecentPickWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 16px;
  ${homePadding};
`;

const DefaultSearchContainer = styled.section``;

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

const RecentSearchContainer = styled.div``;

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
