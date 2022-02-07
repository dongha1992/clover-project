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
} from '@components/Shared/Text';
import { theme, FlexBetween, FlexStart } from '@styles/theme';
import { StickyTab } from '@components/Shared/TabList';
import { useDispatch } from 'react-redux';
import { SPOT_DETAIL_INFO } from '@constants/spot';
import {
  DetailBottomStory,
  DetailBottomStoreInfo,
} from '@components/Pages/Spot';
import { getSpotDetail } from '@api/spot';
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
  lunchDelivery: boolean;
  lunchDeliveryStartTime: string;
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
}

// TODO : 데이터 아직 안들어오는게 많아서 처리 못한게 많음.

const SpotDetailPage = ({id}: ISpotsDetail ): ReactElement => {
  const tabRef = useRef<HTMLDivElement>(null);
  const [spotItem, getSpotItem] = useState<ISpotsDetail>();
  const [selectedTab, setSelectedTab] = useState<string>('/spot/detail/story');
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const HEADER_HEIGHT = 56;
  const sliceLen = spotItem&&spotItem.notices?.length > 1;
  const pickupsLen = spotItem&&spotItem.pickups?.length > 0;
  
  const selectTabHandler = useCallback(
    ({ link }: string) => {
      setSelectedTab(link);
    },
    []
  );

  const onScrollHandler = (e: any) => {
    const offset = tabRef?.current?.offsetTop;
    const scrollTop = e?.srcElement.scrollingElement.scrollTop;
    if (offset) {
      if (scrollTop + HEADER_HEIGHT > offset + 8) {
        setIsStikcy(true);
      } else {
        setIsStikcy(false);
      }
    }
  };

  const renderBottomContent = () => {
    return selectedTab === '/spot/detail/story' ? (
      <DetailBottomStory items={spotItem} />
    ) : (
      <DetailBottomStoreInfo items={spotItem} />
    );
  };

  const tagType = () => {
    const tag = spotItem&&spotItem.placeType;
    switch(tag){
      case 'CAFE':
        return '카페'
      case 'CONVENIENCE':
        return '편의점'
      case 'ETC':
        return 'ETC'
      default:
        return null;
    }
  }

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

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
      //   dispatch(SET_MENU_ITEM({}));
    };
  }, [tabRef?.current?.offsetTop]);

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
            {tagType()}
          </Tag>
        </TagWrapper>
        <TextH2B margin="8px 0 4px 0">{spotItem?.name}</TextH2B>
        <TextB3R display="inline" margin="0 8px 0 0">
          {spotItem?.location?.address}
        </TextB3R>
        {/* <TextH6B
          display="inline"
          color={theme.greyScale65}
          textDecoration="underline"
          pointer
        >
          지도보기
        </TextH6B> */}
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
              {`${spotItem?.lunchDelivery && spotItem.lunchDeliveryStartTime.slice(0,5)} (점심)`}
            </TextB2R>
            <TextB2R>
              {`${spotItem?.dinnerDelivery && spotItem.dinnerDeliveryStartTime.slice(0,5)} (저녁)`}
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
          <FlexStart margin="0 0 16px 0">
            <TextH5B margin="0 20px 0 0">기타정보</TextH5B>
            <TextB2R>{spotItem?.description}</TextB2R>
          </FlexStart>
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
      <BottomContent>{renderBottomContent()}</BottomContent>
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

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id },
  };
}

export default SpotDetailPage;
