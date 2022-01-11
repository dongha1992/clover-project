import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SPOT_ITEMS } from '@constants/mock';
import axios from 'axios';
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
import BorderLine from '@components/Shared/BorderLine';
import { useDispatch } from 'react-redux';
import { SPOT_DETAIL_INFO } from '@constants/spot';
import {
  DetailBottomStory,
  DetailBottomStoreInfo,
} from '@components/Pages/Spot';
import { getSpotDetail } from '@api/spot';
import { IMAGE_S3_URL } from '@constants/mock/index';

export interface IStoreNoti {
  id: number;
};

const SpotDetailPage = ({ id }: IStoreNoti) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const [spotItem, getSpotItem] = useState<any>({});
  const [selectedTab, setSelectedTab] = useState<string>('/spot/detail/story');
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  const getData = async() => {
    try{
      const data = await getSpotDetail(id);
      const items = data.data.data;
      getSpotItem(items);
    }catch(err){
      console.error(err);
    };
  };

  const HEADER_HEIGHT = 56;
  const sliceLen = spotItem?.notices?.length;

  const selectTabHandler = useCallback(
    ({ link }: any) => {
      setSelectedTab(link);
    },
    []
    // [selectedTab]
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
    // const storyitems: any = spotItem?.detail;
    // return selectedTab === '/spot/detail/story' ? (
    //   <DetailBottomStory items={storyitems} />
    // ) : (
    //   <DetailBottomStoreInfo items={storyitems} />
    // );
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
    centerPadding: sliceLen > 1 ? '30px' : '25px',
  };

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
      //   dispatch(SET_MENU_ITEM({}));
    };
  }, [tabRef?.current?.offsetTop]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <SliderWrapper>
        <TopBannerSlider {...settingsTop}>
          {spotItem.images?.map((item: any, index: number) => {
            return <StoreImgWrapper src={`${IMAGE_S3_URL}${item.url}`} alt="스팟 이미지" key={index} />;
          })}
        </TopBannerSlider>
        <SlideCount>{
        spotItem?.images?.length > 1 ? 
        `${currentIndex + 1}/2` 
        : 
        `${currentIndex + 1}/1`
        }</SlideCount>
      </SliderWrapper>
      <StoreWrapper>
        {/* <TagWrapper>
          {spotItem.notices?.map((tags: string, index: number) => {
            return (
              <Tag key={index} margin="0 4px 0 0">
                {tags}
              </Tag>
            );
          })}
        </TagWrapper> */}
        <TextH2B margin="8px 0 4px 0">{spotItem.name}</TextH2B>
        <TextB3R display="inline" margin="0 8px 0 0">
          {spotItem.location?.address}
        </TextB3R>
        <TextH6B
          display="inline"
          color={theme.greyScale65}
          textDecoration="underline"
          pointer
        >
          지도보기
        </TextH6B>
      </StoreWrapper>
      {spotItem?.notices?.length > 0 && (
        <NoticeSlider {...settingNotice}>
          {spotItem.notices?.map(
            ({ desc, date, id }: IStoreNoti) => {
              return (
                <NoticeCard key={id}>
                  <FlexBetween margin="0 0 15px 0">
                    <TextH5B color={theme.brandColor}>공지사항</TextH5B>
                    <TextB3R color={theme.greyScale65}>{date}</TextB3R>
                  </FlexBetween>
                  {desc}
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
          <FlexStart margin="0 0 16px 0">
            <TextH5B margin="0 20px 0 0">도착예정</TextH5B>
            <TextB2R></TextB2R>
          </FlexStart>
          <FlexStart margin="0 0 16px 0">
            <TextH5B margin="0 20px 0 0">픽업가능</TextH5B>
            <TextB2R>{`${spotItem.pickupStartTime}~${spotItem.pickupEndTime}`}</TextB2R>
          </FlexStart>
          <FlexStart margin="0 0 16px 0">
            <TextH5B margin="0 20px 0 0">픽업장소</TextH5B>
            <TextB2R margin="0 8px 0 0">
              {/* {spotItem?.pickups[0]?.name} */}
            </TextB2R>
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
      {/* <BottomContent>{renderBottomContent()}</BottomContent> */}
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
