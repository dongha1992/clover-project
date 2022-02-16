import React, { ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import SpotRecentSearch from '@components/Pages/Spot/SpotRecentSearch';
import { SearchResult } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { theme, FlexBetween, FlexEnd } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B } from '@components/Shared/Text';
import { SpotList, SpotRecommendList } from '@components/Pages/Spot';
import SVGIcon from '@utils/SVGIcon';
import { getSpotSearchRecommend, getSpotEvent, getSpotSearch } from '@api/spot';
import { ISpots } from '@model/index';

const RECENT_SPOT = [
  {
    id: 1,
    name: '유니트아이엔씨',
    location: {
      address: '서울 성동구 왕십리로 115 10층',
      addressDetail: '',
    },
    distance: 121,
    type: 'PRIVATE',
    lunchDeliveryStartTime: '11:00:00',
    lunchDeliveryEndTime: '11:30:00',
    dinnerDeliveryStartTime: '14:00:00',
    dinnerDeliveryEndTime: '18:00:00',
    // availableTime: "12:00-12:30 / 15:30-18:00",
    // spaceType: "프라이빗",
    images: [
      {
        url: '/dev/spot/origin/1_20190213142552',
      },
    ],
    method: 'pickup',
  },
  {
    id: 2,
    name: 'test',
    location: {
      address: '서울 성동구 왕십리로 115 11층',
      addressDetail: '',
    },
    distance: 11,
    type: 'PRIVATE',
    lunchDeliveryStartTime: '11:00:00',
    lunchDeliveryEndTime: '11:30:00',
    dinnerDeliveryStartTime: '14:00:00',
    dinnerDeliveryEndTime: '18:00:00',
    // availableTime: "12:00-12:30 / 15:30-18:00",
    // spaceType: "퍼블릭",
    images: [
      {
        url: '/dev/spot/origin/1_20190213142552',
      },
    ],
    method: 'pickup',
  },
  {
    id: 3,
    name: 'test11',
    location: {
      address: '서울 성동구 왕십리로 115 22층',
      addressDetail: '',
    },
    distance: 11,
    type: 'PUBLIC',
    lunchDeliveryStartTime: '11:00:00',
    lunchDeliveryEndTime: '11:30:00',
    dinnerDeliveryStartTime: '14:00:00',
    dinnerDeliveryEndTime: '18:00:00',
    // availableTime: "12:00-12:30 / 15:30-18:00",
    // spaceType: "퍼블릭",
    images: [
      {
        url: '/dev/spot/origin/1_20190213142552',
      },
    ],
    method: 'pickup',
  },
];

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const [spotRecommend, setSpotRecommend] = useState<ISpots>();
  const [spotEvent, setSpotEvent] = useState<ISpots>();
  const [searchResult, setSearchResult] = useState<ISpots[]>([]);
  const [recentPickedSpotList, setRecentPickedSpotList] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const getSearchRecommendList = async () => {
    const params = {
      latitude: null,
      longitude: null,
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

  const getSpotEventList = async () => {
    const params = {
      latitude: null,
      longitude: null,
      size: 6,
    };
    try {
      const { data } = await getSpotEvent(params);
      const items = data.data;
      setSpotEvent(items);
    } catch (err) {
      console.error(err);
    }
  };

  //최근 픽업 이력
  const getRecentSpotList = async () => {
    setRecentPickedSpotList(RECENT_SPOT);
  };

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
            latitude: null,
            longitude: null,
          };
          const { data } = await getSpotSearch(params);
          const fetchData = data.data;
          // setSpotTest(fetchData);
          const filtered = fetchData?.spots?.filter((c: any) => {
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
    getRecentSpotList();
    getSearchRecommendList();
    getSpotEventList();
  }, []);

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
              <TextH3B>{spotRecommend?.title}</TextH3B>
              <TextB3R color={theme.greyScale65}>500m이내 프코스팟</TextB3R>
            </FlexBetween>
            {spotRecommend?.spots.map((item: any, index: number) => {
              return <SpotRecommendList item={item} key={index} />;
            })}
          </SpotRecommendWrapper>
          <BottomContentWrapper>
            <Row />
            <SpotList items={spotEvent?.spots} title={spotEvent?.title} btnText="주문하기" type="event" />
          </BottomContentWrapper>
        </>
      ) : (
        <>
          {!isSearched ? (
            <DefaultSearchContainer>
              <RecentPickWrapper>
                <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
                {recentPickedSpotList.map((item: any, index) => (
                  <SpotRecentSearch item={item} key={index} onClick={goToOrder} />
                ))}
              </RecentPickWrapper>
            </DefaultSearchContainer>
          ) : (
            <SearchResultContainer>
              <SearchResult searchResult={searchResult} isSpot onClick={goToOrder} />
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
  bacfground: ${theme.white};
`;

export default SpotSearchPage;
