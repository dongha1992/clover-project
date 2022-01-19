import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import { breakpoints } from '@utils/getMediaQuery';
import Tag from '@components/Shared/Tag';
import {
  TextH2B,
  TextB3R,
  TextH5B,
  TextB2R,
  TextH4B,
  TextH6B,
  TextB1R,
} from '@components/Shared/Text';
import { theme, FlexBetween, FlexStart } from '@styles/theme';
import { StickyTab } from '@components/Shared/TabList';
import { useDispatch } from 'react-redux';
import { SPOT_DETAIL_INFO } from '@constants/spot';
import {
  DetailBottomStory,
  DetailBottomStoreInfo,
} from '@components/Pages/Spot';
import { getSpotDetail, getSpotsDetailStory } from '@api/spot';
import { IMAGE_S3_URL } from '@constants/mock/index';
import { ReactElement } from 'hoist-non-react-statics/node_modules/@types/react';

export interface ISpotsDetail {
  coordinate: {
    lat: number;
    lon: number;
  };
  createdAt: string;
  description: string;
  dinnerDelivery: boolean;
  dinnerDeliveryStartTime: string;
  dinnerDeliveryEndTime: string;
  lunchDelivery: boolean;
  lunchDeliveryStartTime: string;
  lunchDeliveryEndTime: string;
  id: number;
  images: [{
    url: string;
    height: number;
    width: number;
    main: boolean;
    size: number;
  }];
  likeCount: number;
  liked: boolean;
  location: {
    address: string;
    addressDetail: string;
    done: string;
    zipCode: string;
  };
  name: string;
  notices: [{
    id: number;
    spotId: number;
    content: string;
    createdAt: string;
  }];
  pickupEndTime: string;
  pickupStartTime: string;
  pickups:[{
    createdAt: string;
    id: number;
    images: [];
    name: string;
    spotId: number;
  }];
  placeHoliday: string;
  placeOpenTime: string;
  placeTel: string;
  placeType: string;
  stories: [{
    id: number;
    spotId: number;
    type: string;
    title: string;
    content: string;
    createdAt: string;
    images: [{
      url: string;
    }];
    liked: boolean;
    likeCount: number;    
  }];
  type: string;  
};

export interface ISpotStories {
  id: number;
  spotId: number;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
  images: [{
    url: string;
    width: string;
    height: string;
    size: string;
  }];
};

// TODO : 데이터 아직 안들어오는게 많아서 처리 못한게 많음.

const SpotDetailPage = ({id}: ISpotsDetail ): ReactElement => {
  const tabRef = useRef<HTMLDivElement>(null);
  const [spotItem, getSpotItem] = useState<ISpotsDetail>();
  const [selectedTab, setSelectedTab] = useState<string>('/spot/detail/story');
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stories, setStories] = useState<ISpotStories[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const HEADER_HEIGHT = 56;
  const sliceLen = spotItem&&spotItem.notices?.length > 1;
  const pickupsLen = spotItem&&spotItem.pickups?.length > 0;
  
  const selectTabHandler = useCallback(
    ({ link }: string) => {
      setSelectedTab(link);
    },
    []
  );

  const onScrollHandler = () => {
    const offset = tabRef?.current?.offsetTop;
    const scrollTop = document.documentElement.scrollTop;
    if (offset) {
      if (scrollTop + HEADER_HEIGHT > offset + 8) {
        setIsStikcy(true);
      } else {
        setIsStikcy(false);
      }
    }
  };

  const placeType = () => {
    const tag = spotItem&&spotItem.placeType;
    switch(tag){
      case 'CAFE':
        return '카페'
      case 'CONVENIENCE_STORE':
        return '편의점'
      case 'ETC':
        return '기타'
      case 'BOOKSTORE':
        return '서점'
      case 'DRUGSTORE':
        return '약국'
      case 'FITNESS_CENTER':
        return '휘트니스센터'
      case 'OFFICE':
        return '오피스'
      case 'SHARED_OFFICE':
        return '공유오피스'
      case 'STORE':
        return '스토어'
      case 'SCHOOL':
        return '학교'
      default:
        return null;
    }
  };

  const settingsTop = {
    arrows: false,
    dots: false,
    speed: 500,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: false,
    infinite: true,
    customPagimg: () => <div />,
    centerPadding: '20px',
    afterChange: (indexOfCurrentSlide: number) => {
      setCurrentIndex(indexOfCurrentSlide);
    },
  };

  const settingNotice = {
    arrows: false,
    dots: false,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: false,
    centerPadding: sliceLen ? '30px' : '25px',
  };

  // 스팟 상세 데이터 fetch
  useEffect(() => {
    const getData = async() => {
      try{
        const {data} = await getSpotDetail(id);
        getSpotItem(data.data);
      }catch(err){
        console.error(err);
      };
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  // 스팟 상세 스토리 데이터 fetch
  useEffect(()=> {
    const getData = async() => {
      try{
          const {data} = await getSpotsDetailStory(id, page);
          const list = data?.data.spotStories;
          const lastPage = data.data.pagination;
          setStories((prevList)=>[...prevList, ...list]);
          setIsLastPage(page === lastPage.totalPage);
      }catch(err){
        if(err)
        console.error(err);
      };
    }
    getData();
  }, [page]);

  // 스팟 상세 스토리 10개 이상인 경우 무한스크롤
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
        // 페이지 끝에 도달하면 page 파라미터 값에 +1 주고, 데이터 받아온다.
        setPage(page + 1);
      };
     };  
    // scroll event listener 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  },[stories.length > 0]);

  // 스팟 상세 하단 스토리, 매장정보 스티키
  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
      //   dispatch(SET_MENU_ITEM({}));
    };
  }, [tabRef?.current?.offsetTop]);

  return (
    <Container>
      <SliderWrapper>
        <TopBannerSlider {...settingsTop}>
          {spotItem?.images?.map((item, idx: number) => {
            return <StoreImgWrapper src={`${IMAGE_S3_URL}${item.url}`} alt="스팟 이미지" key={idx} />;
          })}
        </TopBannerSlider>
        <SlideCount>{spotItem&&spotItem.images?.length > 1 ? 
        `${currentIndex + 1}/2` 
        : 
        `${currentIndex + 1}/1`
        }</SlideCount>
      </SliderWrapper>
      <StoreWrapper>
        <TagWrapper>
          <Tag>
            {placeType()}
          </Tag>
        </TagWrapper>
        <TextH2B margin="8px 0 4px 0">{spotItem?.name}</TextH2B>
        <TextB3R display="inline" margin="0 8px 0 0">
          {`${spotItem?.location?.address} ${spotItem?.location?.addressDetail}`}
        </TextB3R>
      </StoreWrapper>
      {spotItem && spotItem.notices?.length > 0 && (
        <NoticeSlider {...settingNotice}>
          {spotItem?.notices?.map(
            ({createdAt, content}, idx) => {
              return (
                <NoticeCard key={idx}>
                  <FlexBetween margin="0 0 15px 0">
                    <TextH5B color={theme.brandColor}>공지사항</TextH5B>
                    <TextB3R color={theme.greyScale65}>{createdAt?.split(' ')[0]}</TextB3R>
                  </FlexBetween>
                  {content}
                </NoticeCard>
              );
            }
          )}
        </NoticeSlider>
      )}
      <PickupWrapper>
        <TextH5B color={theme.greyScale65} margin="0 0 16px 0">
          픽업정보
        </TextH5B>
        <PickupInfo>
          <FlexStart margin="0 0 16px 0" alignItems='flex-start'>
            <TextH5B margin="0 20px 0 0">도착예정</TextH5B>
            <div>
            <TextB2R>
              {`${spotItem?.lunchDeliveryStartTime}~${spotItem?.lunchDeliveryEndTime} (점심)`}
              {/* {`${spotItem?.lunchDelivery && spotItem.lunchDeliveryStartTime.slice(0,5)} (점심)`} */}
            </TextB2R>
            <TextB2R>
              {`${spotItem?.dinnerDeliveryStartTime}~${spotItem?.dinnerDeliveryEndTime} (저녁)`}
              {/* {`${spotItem?.dinnerDelivery && spotItem.dinnerDeliveryStartTime.slice(0,5)} (저녁)`} */}
            </TextB2R>
            </div>
          </FlexStart>
          <FlexStart margin="0 0 16px 0">
            <TextH5B margin="0 20px 0 0">픽업가능</TextH5B>
            <TextB2R>{`${spotItem?.pickupStartTime}~${spotItem?.pickupEndTime}`}</TextB2R>
          </FlexStart>
          <FlexStart margin="0 0 16px 0">
            <TextH5B margin="0 20px 0 0">픽업장소</TextH5B>
            {
              pickupsLen &&
              <TextB2R margin="0 8px 0 0">
                {spotItem.pickups[0].name}
              </TextB2R>
            }
            <TextH6B
              color={theme.greyScale65}
              textDecoration="underline"
              pointer
            >
              이미지로 보기
            </TextH6B>
          </FlexStart>
          {
            spotItem?.description &&
            <FlexStart margin="0 0 16px 0">
              <TextH5B margin="0 20px 0 0">기타정보</TextH5B>
              <TextB2R>{spotItem?.description}</TextB2R>
            </FlexStart>
          }
        </PickupInfo>
      </PickupWrapper>
      <SpotEventBannerWrapper>
        <TextH4B>해당 스팟 이벤트 영역</TextH4B>
      </SpotEventBannerWrapper>
      {/* <BorderLine height={8} ref={tabRef} /> */}
      <BottomTabWrapper>
        <StickyTab
          tabList={SPOT_DETAIL_INFO}
          isSticky={isSticky}
          selectedTab={selectedTab}
          onClick={selectTabHandler}
        />
      </BottomTabWrapper>
      <BottomContent>
        {
          selectedTab === '/spot/detail/story' ?
            stories.length > 0 ? (
              stories?.map((list, idx)=>{
                return (
                  <DetailBottomStory list={list} key={idx} />
                )
              })
            ) : (
              <NonContentWrapper>
                <TextB1R color={theme.greyScale65}>아직 스토리가 없어요.😭</TextB1R>
              </NonContentWrapper>
              )
            :
            (
              <DetailBottomStoreInfo 
                lat={spotItem?.coordinate.lat} 
                lon={spotItem?.coordinate.lon}
                placeOpenTime={spotItem?.placeOpenTime}
                placeHoliday={spotItem?.placeHoliday}
                placeTel={spotItem?.placeTel}
              />
            )
        }
      </BottomContent>
    </Container>
  );
};

const Container = styled.main``;

const SliderWrapper = styled.section`
  position: relative;
`;

const TopBannerSlider = styled(Slider)`
  max-width: ${breakpoints.mobile}px;
  min-width: ${breakpoints.sm}px;
`;

const SlideCount = styled.div`
  width: 40px;
  height: 26px;
  border-radius: 24px;
  background: #24242480;
  color: ${theme.white};
  text-align: center;
  padding: 5px 0;
  display: inline-block;
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 50;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0.9px;
`;

const StoreImgWrapper = styled.img`
  width: 100%;
  object-fit: cover;
`;

const StoreWrapper = styled.section`
  margin: 24px;
`;

const TagWrapper = styled.section``;

const NoticeSlider = styled(Slider)`
  width: 100%;
  background: ${theme.greyScale6};
  padding: 16px 0;
  .slick-slide > div {
    padding: 0 5px;
  }
`;

const NoticeCard = styled.div`
  background: ${theme.white};
  border: 1px solid ${theme.greyScale6};
  padding: 16px;
  border-radius: 8px;
`;

const PickupWrapper = styled.section`
  margin: 24px;
`;

const PickupInfo = styled.div``;

const SpotEventBannerWrapper = styled.section`
  width: 100%;
  height: 96px;
  background: ${theme.greyScale6};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomTabWrapper = styled.section`
  width: 100%;
`;

const BottomContent = styled.section``;

const NonContentWrapper = styled.div`
  padding: 24px;
  width: 100%;
  height: 483px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id },
  };
}

export default SpotDetailPage;
