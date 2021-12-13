import React, {useState, useEffect, useCallback, useRef} from 'react';
import { SPOT_ITEMS } from '@constants/mock';
import axios from 'axios';
import styled from 'styled-components';
import Slider from 'react-slick';
import { breakpoints } from '@utils/getMediaQuery';
import Tag from '@components/Tag';
import {TextH2B, TextB3R, TextH5B, TextB2R, TextH4B, TextH6B} from '@components/Text';
import { theme, FlexBetween, FlexStart } from '@styles/theme';
import StickyTab from '@components/TabList/StickyTab';
import BorderLine from '@components/BorderLine';
import { useDispatch } from 'react-redux';
import { SPOT_DETAIL_INFO } from '@constants/spot';
import DetailBottomStoreInfo from '../detailBottom/DetailBottomStoreInfo';
import DetailBottomStory from '../detailBottom/DetailBottomStory';

export interface IStoreNoti {
    desc: string;
    date: string;
    index: number;
}

const spotDetail = ({id}: any) => {
  const [spotItem, getSpotItem] = useState<any>({});
  const [selectedTab, setSelectedTab] = useState<string>('/spot/detail/story');
  const [isSticky, setIsStikcy] = useState<boolean>(false);

  const tabRef = useRef<HTMLDivElement>(null);

  const getData = () => {
    const spotData: any = SPOT_ITEMS.find((item)=> item.id === Number(id));
    getSpotItem(spotData);
  };

  const HEADER_HEIGHT = 56;
  const sliceLen = spotItem.detail?.noticeDetail.length;

  const selectTabHandler = useCallback(
    ({ link }: any) => {
      setSelectedTab(link);
    },
    [selectedTab]
  );

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
    //   dispatch(SET_MENU_ITEM({}));
    };
  }, [tabRef?.current?.offsetTop]);

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
        const storyitems: any = spotItem?.detail?.story;
        return selectedTab === '/spot/detail/story' 
        ? 
        <DetailBottomStory items={storyitems} /> 
        : 
        <DetailBottomStoreInfo />;
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
  };

  const settingNotice = {
    arrows: false,
    dots: false,
    speed: 500,
    sliderToShow: 1,
    slidersToScroll: 0,
    centerMode: true,
    infinite: false,
    adaptiveHeight: true,
    centerPadding: sliceLen >1 ? '30px':'25px',
  }

  useEffect(()=> {
      getData();
  },[])

  return (
    <Container>
    <SliderContainer>
      <Slider {...settingsTop}>
        {spotItem.detail?.imgUrl?.map((img: string, index: number)=>{
          return (
            <StoreImgWrapper
              src = {img}
              alt = '스팟 이미지'
              key = {index}
            />
          )
        })}
      </Slider>
    </SliderContainer>
      <StoreWrapper>
        <TagWrapper>
          {
            spotItem.detail?.tag?.map((tags: string, index: number)=> {
              return <Tag key={index} margin="0 4px 0 0">{tags}</Tag>
            })
          }
        </TagWrapper>
        <TextH2B margin="8px 0 4px 0">
          {spotItem.location}
        </TextH2B>
        <TextB3R display='inline' margin='0 8px 0 0'>
          {spotItem.detail?.address}
        </TextB3R>
        <TextH6B display='inline' color={theme.greyScale65} textDecoration='underline' pointer>지도보기</TextH6B>
      </StoreWrapper>
      {
        spotItem.detail?.notice &&
        <NoticeWrapper>
          <Slider {...settingNotice}>
          {spotItem.detail.noticeDetail?.map(({desc, date ,index}:IStoreNoti)=>{
            return (
              <NoticeCard
                key = {index}
              >
                  <FlexBetween margin='0 0 15px 0'>
                    <TextH5B color={theme.brandColor}>공지사항</TextH5B>
                    <TextB3R color={theme.greyScale65}>{date}</TextB3R>
                  </FlexBetween>
                {desc}
              </NoticeCard>
            )
        })}
      </Slider>
        </NoticeWrapper>
      }
      <PickupWrapper>
        <TextH5B color={theme.greyScale65} margin='0 0 16px 0'>
          {spotItem.detail?.pickUpInfo.pickUpText}
        </TextH5B>
        <PickupInfo>
          <FlexStart margin='0 0 16px 0'>
            <TextH5B margin='0 20px 0 0'>
              도착예정
            </TextH5B>
            <TextB2R>
              {spotItem.detail?.pickUpInfo.arrivalText}
            </TextB2R>
          </FlexStart>
          <FlexStart margin='0 0 16px 0'>
            <TextH5B margin='0 20px 0 0'>
              픽업가능
            </TextH5B>
            <TextB2R>
              {spotItem.detail?.pickUpInfo.pickUpTime}
            </TextB2R>
          </FlexStart>
          <FlexStart margin='0 0 16px 0'>
            <TextH5B margin='0 20px 0 0'>
              픽업장소
            </TextH5B>
            <TextB2R margin='0 8px 0 0'>
              {spotItem.detail?.pickUpInfo.pickUpSpot}
            </TextB2R>
            <TextH6B color={theme.greyScale65} textDecoration='underline' pointer>이미지로 보기</TextH6B>
          </FlexStart>
          <FlexStart margin='0 0 16px 0'>
            <TextH5B margin='0 20px 0 0'>
              기타정보
            </TextH5B>
            <TextB2R>
              {spotItem.detail?.pickUpInfo.pickUpEtc}
            </TextB2R>
          </FlexStart>
        </PickupInfo>
      </PickupWrapper>
      <SpotEventBannerWrapper>
        <TextH4B>
          해당 스팟 이벤트 영역
        </TextH4B>
      </SpotEventBannerWrapper>
      <BorderLine height={8} ref={tabRef} />
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
  )
};
const Container = styled.main``;
const SliderContainer = styled.section`
  max-width: ${breakpoints.mobile}px;
  min-width: ${breakpoints.sm}px;
  .slick-slider {
    .slick-list {
      padding: 0 !important;
      .slick-track {
        .slick-slide {
        }
      }
    }
    .slick-dots {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
    .slick-dots li.slick-active {
      color: #767e90;
  }
}
`

const StoreImgWrapper = styled.img`
  width: 100%;
  object-fit: cover;
`

const StoreWrapper = styled.div`
  margin: 24px;
`

const TagWrapper = styled.section`
`

const NoticeWrapper = styled.section`
  width: 100%;
  background: ${theme.greyScale6};
  padding: 16px 0;
  .slick-slider {
    .slick-list {
      padding: 0 !important;
      .slick-track {
        margin-left: 24px;
        .slick-slide {
            margin-right: 8px;
        }
      }
    }
`

const NoticeCard = styled.div`
  width: 100%;
  height: 100%;
  background: ${theme.white};
  border: 1px solid: ${theme.greyScale6};
  padding: 16px;
  border-radius: 8px;
`

const PickupWrapper = styled.section`
  margin: 24px;
`

const PickupInfo = styled.div`
`

const SpotEventBannerWrapper = styled.div`
  width: 100%;
  height: 96px;
  background: ${theme.greyScale6};
  display: flex;
  justify-content: center;
  align-items: center;
`

const BottomTabWrapper = styled.div``

const BottomContent = styled.div``

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    return {
      props: { id },
    };
  }  

export default spotDetail;