import React, { useState, useEffect, useCallback, useRef, ReactElement } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import { Tag } from '@components/Shared/Tag';
import { TextH2B, TextB3R, TextH5B, TextB2R, TextH4B, TextH6B, TextB1R } from '@components/Shared/Text';
import { theme, FlexBetween, FlexStart, textH5 } from '@styles/theme';
import { StickyTab } from '@components/Shared/TabList';
import { useDispatch } from 'react-redux';
import { SPOT_DETAIL_INFO } from '@constants/spot';
import { DetailBottomStory, DetailBottomStoreInfo } from '@components/Pages/Spot';
import { getSpotDetail, getSpotsDetailStory } from '@api/spot';
import { SPOT_ITEM } from '@store/spot';
import { ISpotsDetail, ISpotStories } from '@model/index';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { SET_IMAGE_VIEWER } from '@store/common';
import router from 'next/router';
import { useQuery } from 'react-query';
import Carousel from '@components/Shared/Carousel';
import NextImage from 'next/image';

interface IParams {
  id: number;
}

const SpotDetailPage = (): ReactElement => {
  const dispatch = useDispatch();
  const tabRef = useRef<HTMLDivElement>(null);
  // const [spotItem, getSpotItem] = useState<ISpotsDetail>();
  const [selectedTab, setSelectedTab] = useState<string>('/spot/detail/story');
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stories, setStories] = useState<ISpotStories[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const HEADER_HEIGHT = 56;

  // 스팟 상세 스토리 10개 이상인 경우 무한스크롤
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
  }, [stories.length > 0]);

  // 스팟 상세 하단 스토리, 매장정보 스티키
  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
      //   dispatch(SET_MENU_ITEM({}));
    };
  }, [tabRef?.current?.offsetTop]);

  // 스팟 상세 api
  const {
    data: spotItem,
    error: spotError,
    isLoading: isSpotLoading,
  } = useQuery(
    'getSpotDetail',
    async () => {
      const { data } = await getSpotDetail(id!);
      return data?.data;
    },

    {
      onSuccess: (data) => {
        dispatch(SPOT_ITEM(data));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  // 스팟 상세 스토리 api
  const {
    data,
    error: spotStoryError,
    isLoading: isSpotStoryLoading,
  } = useQuery(
    'getSpotDetailStory',
    async () => {
      const { data } = await getSpotsDetailStory(id!, page);
      return data?.data;
    },

    {
      onSuccess: (data) => {
        const lastPage = data.pagination;
        setStories((prevList) => [...prevList, ...data.spotStories]);
        setIsLastPage(page === lastPage.totalPage);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const sliceLen = spotItem && spotItem.notices?.length > 1;
  const pickupsLen = spotItem && spotItem.pickups?.length;
  const imgTotalLen = spotItem && spotItem.images?.length;

  useEffect(() => {
    if (router.isReady) {
      setId(Number(router.query?.id));
    }
  }, [router.isReady]);

  const selectTabHandler = useCallback(({ link }: string) => {
    setSelectedTab(link);
  }, []);

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
    const tag = spotItem && spotItem.placeType;
    switch (tag) {
      case 'CAFE':
        return '카페';
      case 'CONVENIENCE_STORE':
        return '편의점';
      case 'BOOKSTORE':
        return '서점';
      case 'DRUGSTORE':
        return '약국';
      case 'FITNESS_CENTER':
        return '휘트니스센터';
      case 'STORE':
        return '일반상점';
      case 'ETC':
        return null;
      case 'OFFICE':
        return null;
      case 'SHARED_OFFICE':
        return null;
      case 'SCHOOL':
        return null;
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

  if (isSpotLoading) {
    return <div>loading...</div>;
  }

  const openImgViewer = (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
  };

  const goToSpotNotice = (): void => {
    router.push('/spot/notice');
  };

  return (
    <Container>
      {spotItem?.isTrial && (
        <TopNoticeWrapper>
          <TextH5B color={theme.white}>n월 n일까지 임시 사용 가능한 프코스팟이에요!</TextH5B>
        </TopNoticeWrapper>
      )}
      <ImageWrapper>
      {
        spotItem?.isTrial ? (
          <NextImage 
            src='/images/fcospot/img_fcospot_default.png'
            width={512}
            height={383}
            alt="트라이얼 프코스팟 인 경우 또는 등록된 이미지가 없는 경우의 이미지"
            layout="responsive"
          />
        ) : (
          <Carousel images={spotItem?.images?.map(banner => ({ src: banner.url }))} />
        )
      }
      </ImageWrapper>
      {/* 스팟 상세 상단 태그 리스트 */}
      <PlaceTypeTagWrapper>
        <>
          {spotItem?.isTrial ? (
            <Tag margin="0 5px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale65}>
              트라이얼
            </Tag>
          ) : spotItem?.type === 'PRIVATE' ? (
            <Tag margin="0 5px 0 0" backgroundColor={theme.brandColor5P} color={theme.brandColor}>
              프라이빗
            </Tag>
          ) : null}
          {spotItem?.type !== 'PRIVATE' && placeType() !== null && 
            <Tag margin="0 5px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale65}>{placeType()}</Tag>}
          {spotItem?.canEat && <Tag margin="0 5px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale65}>취식가능</Tag>}
          {spotItem?.canParking && <Tag margin="0 5px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale65}>주차가능</Tag>}
          {!!spotItem?.discountRate && (
            <Tag
              margin="0 5px 0 0"
              backgroundColor={theme.brandColor5P}
              color={theme.brandColor}
            >{`${spotItem?.discountRate}% 할인 중`}</Tag>
          )}
          {!spotItem?.isOpened && (
            <Tag margin="0 5px 0 0" backgroundColor={theme.brandColor5P} color={theme.brandColor}>
              오픈예정
            </Tag>
          )}
        </>
        <TextH2B margin="8px 0 4px 0">{spotItem?.name}</TextH2B>
        <TextB2R display="inline" margin="0 8px 0 0">
          {`${spotItem?.location?.address} ${spotItem?.location?.addressDetail}`}
        </TextB2R>
      </PlaceTypeTagWrapper>
      {spotItem?.notices?.length! > 0 && (
        <NoticeSlider {...settingNotice}>
          {spotItem?.notices?.map(({ createdAt, content }, idx) => {
            return (
              <NoticeCard key={idx}>
                <FlexBetween margin="0 0 15px 0">
                  <TextH5B color={theme.brandColor}>공지사항</TextH5B>
                  <TextB3R color={theme.greyScale65}>{createdAt?.split(' ')[0]}</TextB3R>
                </FlexBetween>
                {content}
              </NoticeCard>
            );
          })}
        </NoticeSlider>
      )}
      <PickupWrapper>
        <TextH5B color={theme.greyScale65} margin="0 0 16px 0">
          픽업정보
        </TextH5B>
        <PickUpInfoWrapper>
          <tbody>
            <PickUpInfoContent>
              <th>
                <TextTitle>도착예정</TextTitle>
              </th>
              <td>
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
              </td>
            </PickUpInfoContent>
            {spotItem?.type !== 'PRIVATE' && (
              <PickUpInfoContent>
                <th>
                  <TextTitle>픽업가능</TextTitle>
                </th>
                <td>
                  <TextB2R>{`${spotItem?.pickupStartTime}~${spotItem?.pickupEndTime}`}</TextB2R>
                </td>
              </PickUpInfoContent>
            )}
            <PickUpInfoContent>
              <th>
                <TextTitle>픽업장소</TextTitle>
              </th>
              <td>
                <div>
                  {spotItem?.pickups.map((i, idx) => {
                    return (
                      <FlexStart key={idx}>
                        <TextB2R margin="0 8px 0 0">{i.name}</TextB2R>
                        {i?.images?.map((j: { url: string }, idx) => {
                          return (
                            <TextH6B
                              key={idx}
                              color={theme.greyScale65}
                              textDecoration="underline"
                              pointer
                              onClick={() => openImgViewer(j?.url)}
                            >
                              이미지로 보기
                            </TextH6B>
                          );
                        })}
                      </FlexStart>
                    );
                  })}
                </div>
              </td>
            </PickUpInfoContent>
            {spotItem?.description && (
              <PickUpInfoContent>
                <th>
                  <TextTitle>기타정보</TextTitle>
                </th>
                <td>
                  <TextB2R>{spotItem?.description}</TextB2R>
                </td>
              </PickUpInfoContent>
            )}
          </tbody>
        </PickUpInfoWrapper>
      </PickupWrapper>
      <SpotEventBannerWrapper onClick={goToSpotNotice}>
        <NextImage 
          src='/images/fcospot/img_banner_fco_info_360_96.png'
          width={512}
          height={110}
          alt="프코스팟 상세 페이지 중간 배너"
        />
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
        {selectedTab === '/spot/detail/story' ? (
          stories.length > 0 ? (
            stories?.map((list, idx) => {
              return <DetailBottomStory list={list} key={idx} />;
            })
          ) : (
            <NonContentWrapper>
              <TextB1R color={theme.greyScale65}>아직 스토리가 없어요.😭</TextB1R>
            </NonContentWrapper>
          )
        ) : (
          <DetailBottomStoreInfo
            lat={spotItem?.coordinate.lat}
            lon={spotItem?.coordinate.lon}
            placeOpenTime={spotItem?.placeOpenTime}
            placeHoliday={spotItem?.placeHoliday}
            placeTel={spotItem?.placeTel}
          />
        )}
      </BottomContent>
    </Container>
  );
};

const Container = styled.main``;

const TopNoticeWrapper = styled.div`
  width: 100%;
  height: 45px;
  position: fiex;
  top: 0px;
  z-index: 50;
  background: ${theme.brandColor};
  padding: 12px 48px;
  text-align: center;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PlaceTypeTagWrapper = styled.section`
  padding: 24px 24px 16px 24px;
`;

const NoticeSlider = styled(Slider)`
  width: 100%;
  background: ${theme.greyScale6};
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
  padding: 16px 24px 16px 24px;
`;

const TextTitle = styled.div`
  width: 70px;
  ${textH5};
`;

const PickUpInfoWrapper = styled.table`
  display: flex;
  flex-direction: column;
`;

const PickUpInfoContent = styled.tr`
  display: flex;
  flex-direction: row;
  padding: 0 0 16px 0;
  th {
    text-align: left;
  }
`;

const SpotEventBannerWrapper = styled.section`
  width: 100%;
  height: 100%;
  cursor: pointer;
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

export default React.memo(SpotDetailPage);
