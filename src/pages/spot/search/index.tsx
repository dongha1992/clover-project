import React, {
  ReactElement,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import SpotItem from '@components/Pages/Spot/SpotItem';
import axios from 'axios';
import { SearchResult } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { SPOT_URL } from '@constants/mock';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { theme, fixedBottom, FlexBetween, FlexEnd } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B } from '@components/Shared/Text';
import { SpotList, SpotRecommendList } from '@components/Pages/Spot';
import { SPOT_ITEMS } from '@constants/mock';
import { Item } from '@components/Item';
import SVGIcon from '@utils/SVGIcon';

const SPOT_RECOMMEND_LIST = [
  {
    id: 1,
    name: '헤이그라운드 서울숲점',
    address: '서울 성동구 왕십리로 115 10층',
    meter: 121,
    type: '픽업',
    availableTime: '12:00-12:30 / 15:30-18:00',
    spaceType: ['프라이빗', '5% 할인중'],
    url: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
  },
  {
    id: 2,
    name: '헤이그라운드 성수점',
    address: '서울 성동구 왕십리로 115 10층',
    meter: 11,
    type: '픽업',
    availableTime: '12:00-12:30 / 15:30-18:00',
    spaceType: '퍼블릭',
    url: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
  },
  {
    id: 3,
    name: '헤이그라운드 성수시작점',
    address: '서울 성동구 왕십리로 115 10층 ㅁㄴㅇㅁㄴ',
    meter: 11,
    type: '픽업',
    availableTime: '12:00-12:30 / 15:30-18:00',
    spaceType: '트라이얼',
    url: 'https://image.ajunews.com/content/image/2020/08/29/20200829141039628211.jpg',
  },
];

const SpotSearchPage = (): ReactElement => {
  const [spotList, setSpotList] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [recentPickedSpotList, setRecentPickedSpotList] = useState<string[]>(
    []
  );
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const dispatch = useDispatch();
  console.log(!searchResult.length);
  useEffect(() => {
    getSpotList();
    // inputRef.current?.focus()
    // focus();
  }, []);

  // const focus = (): void => {
  //   if(inputRef.current.focus()){
  //      setInputFocus(true);
  //   }else {
  //     setInputFocus(false);
  //   }
  // };
  const getSpotList = async () => {
    const { data } = await axios.get(`${SPOT_URL}`);
    setSpotList(data);
    const temp = data.slice();
    temp.pop();
    setRecentPickedSpotList(temp);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIsSearched(false);
    setInputText(value);
    if (!value) {
      setSearchResult([]);
    }
  };

  const getSearchResult = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const { value } = e.target as HTMLInputElement;

    if (e.key === 'Enter') {
      if (!value) {
        setSearchResult([]);
        return;
      }

      setIsSearched(true);

      const filtered = spotList.filter((c) => {
        return c.name.replace(/ /g, '').indexOf(value) > -1;
      });

      if (filtered.length > 0) {
        setSearchResult(filtered);
      } else {
        // 검색 결과 없음
        setSearchResult('');
      }
    }
  };

  const goToOrder = useCallback(() => {
    dispatch(
      setBottomSheet({
        content: <PickupSheet />,
        buttonTitle: '주문하기',
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Wrapper>
        <TextInput
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          ref={inputRef}
        />
      </Wrapper>
      {/* <SpotRecommendWrapper>
        <FlexEnd padding='0 0 24px 0'>
          <SVGIcon name='locationBlack' />
          <TextH6B margin='0 0 0 2px' padding='3px 0 0 0'>현 위치로 설정하기</TextH6B>
        </FlexEnd>
        <FlexBetween margin='0 0 24px 0'>
          <TextH3B>추천 스팟</TextH3B>
          <TextB3R>500m이내 프코스팟</TextB3R>
        </FlexBetween>
        {
          SPOT_RECOMMEND_LIST.map((item: any, index)=> (
            <SpotRecommendList item={item} key={index} />
          ))
        }
      </SpotRecommendWrapper>
      <BottomContentWrapper>
        <Row />
        <SpotList items={SPOT_ITEMS} title='이벤트 진행중인 스팟' type="event" />
      </BottomContentWrapper> */}

      {!searchResult.length ? (
        <DefaultSearchContainer>
          <RecentPickWrapper>
            <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
            {recentPickedSpotList.map((item: any, index) => (
              <SpotItem item={item} key={index} onClick={goToOrder} />
            ))}
          </RecentPickWrapper>
        </DefaultSearchContainer>
      ) : (
        <SearchResultContainer>
          <SearchResult
            searchResult={searchResult}
            isSpot
            onClick={goToOrder}
          />
        </SearchResultContainer>
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

const SearchResultContainer = styled.div`
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
