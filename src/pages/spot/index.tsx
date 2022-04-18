import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH4B, TextB2R, TextH6B, TextH5B } from '@components/Shared/Text';
import { theme, FlexBetween, FlexCenter } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';
import { useRouter } from 'next/router';
import { SpotList } from '@components/Pages/Spot';
import {
  getNewSpots,
  getStationSpots,
  getSpotEvent,
  getSpotPopular,
  getInfo,
  getSpotRegistrationsRecruiting,
} from '@api/spot';
import { IParamsSpots, ISpotRegistrationsResponse, ISpotsInfo } from '@model/index';
import { useQuery } from 'react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSelector } from 'react-redux';
import { userForm } from '@store/user';
import { spotSelector } from '@store/spot';
import { destinationForm } from '@store/destination';

const trialRes = [
  {
    title: '제이앤케이 (전자조합회관빌...',
    address: '서울 서초구 방배동 925-22 3층 ...',
    distance: '125',
    meter: 'METER',
    userCount: '56',
    submit: false,
  },
  {
    title: '노스테라스',
    address: '서울 서초구 방배동 925-22 3층 ...',
    distance: '125',
    meter: 'METER',
    userCount: '56',
    submit: true,
  },
  {
    title: '제이앤케이 (전자조합회관빌...',
    address: '서울 서초구 방배동 925-22 3층 ...',
    distance: '125',
    meter: 'METER',
    userCount: '56',
    submit: false,
  },
  {
    title: '제이앤케이 (전자조합회관빌...',
    address: '서울 서초구 방배동 925-22 3층 ...',
    distance: '125',
    meter: 'METER',
    userCount: '56',
    submit: true,
  },
];


const FCO_SPOT_BANNER = [
  {
    id: 1,
    text: '나의 회사∙학교를 프코스팟으로\n만들어보세요!',
    type: 'private',
    icon: 'blackCirclePencil',
  },
  {
    id: 2,
    text: '내가 자주가는 장소를 프코스팟으로\n만들어보세요!',
    type: 'public',
    icon: 'blackCirclePencil',
  },
  {
    id: 3,
    text: '우리 가게를 프코스팟으로 만들고\n더 많은 고객들을 만나보세요!',
    type: 'owner',
    icon: 'blackCirclePencil',
  },
];

// TODO : 로그인 유저별 분기처리, 단골 api , 타입에러

const SpotPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { me, isLoginSuccess } = useSelector(userForm);
  const { spotsPosition } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [info, setInfo] = useState<ISpotsInfo>();
  const [spotRegistraions, setSpotRegistrations] = useState<ISpotRegistrationsResponse>();
  const [spotCount, setSpotCount] = useState<number>(0);

  const registrationsLen = info && !!info?.recruitingSpotRegistrations?.length;
  const unsubmitSpotRegistrationsLen = info && !!info?.unsubmitSpotRegistrations?.length;
  const trialRegistrationsLen = info && !!info?.trialSpotRegistrations?.length;

  const params: IParamsSpots = {
    latitude: spotsPosition ? spotsPosition.latitude : null,
    longitude: spotsPosition? spotsPosition.longitude : null,
    size: 6,
  };

  // react-query

  const { data: stationSpotList, isLoading: isLoadingStation } = useQuery(
    ['spotList', 'STATION'],
    async () => {
      const response = await getStationSpots(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: newSpotList, isLoading: isLoadingNew } = useQuery(
    ['spotList', 'NEW'],
    async () => {
      const response = await getNewSpots(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: eventSpotList, isLoading: isLoadingEvent } = useQuery(
    ['spotList', 'EVENT'],
    async () => {
      const response = await getSpotEvent(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: popularSpotList, isLoading: isLoadingPopular } = useQuery(
    ['spotList', 'POPULAR'],
    async () => {
      const response = await getSpotPopular(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    const getInfoData = async () => {
      try {
        const { data } = await getInfo();
        setSpotCount(data.data.spotCount);
        setInfo(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    getInfoData();

    // 단골 스팟
    const getRegistration = async () => {
      try {
        const { data } = await getSpotRegistrationsRecruiting(params);
        setSpotRegistrations(data);
      } catch (err) {
        console.error(err);
      }
    };

    getRegistration();
  }, [spotsPosition]);

  const goToShare = (e: any): void => {
      // dispatch(initBottomSheet());
      dispatch(
        SET_BOTTOM_SHEET({
          content: <ShareSheet />,
        })
      );
  };

  const goToSpotReq = (type: string): void => {
    router.push({
      pathname: '/spot/spot-req',
      query: { type },
    });
  };

  const goToSpotStatus = (): void => {
    router.push('/mypage/spot-status');
  };

  const goToRegiList = (): void => {
    router.push('/spot/regi-list');
  };

  const goToSpotNotice = ():void => {
    router.push('/spot/notice');
  };

  const isLoading = isLoadingStation && isLoadingNew && isLoadingEvent && isLoadingPopular;

  if(isLoading){
    return <div>loading...</div>;
  };

  return (
    <Container>
      <HeaderTitle>
        <TextH2B padding="24px 24px 0 24px">
          {`${spotCount}개의 프코스팟이\n`}
          {isLoginSuccess ? <span>{me?.name}</span> : '회원'}님을 기다려요!
        </TextH2B>
      </HeaderTitle>
      <RegistrationsCTAWrapper>
        <RegistrationCTA onClick={goToRegiList}>
          <FlexCenter>
            <SVGIcon name="plusWhite" />
            <TextH5B padding="3px 0 0 0" color={theme.white}>
              프코스팟 신청할래요
            </TextH5B>
          </FlexCenter>
        </RegistrationCTA>
      </RegistrationsCTAWrapper>
      {isLoginSuccess && (
        <TopCTASlider
          className="swiper-container"
          slidesPerView={'auto'}
          spaceBetween={15}
          speed={500}
        >
          {
            /* 청한 프코스팟 알림카드 - 참여인원 5명 미만 일때 */
            registrationsLen && (
              <SwiperSlide className="swiper-slide">
                <BoxHandlerWrapper onClick={goToShare}>
                  <FlexBetween height="92px" padding="22px">
                    <TextH4B>
                      {`[${info?.recruitingSpotRegistrations[0].placeName}]\n`}
                      <span>{`${5 - info?.recruitingSpotRegistrations[0].recruitingCount}`}</span>
                      명만 더 주문 하면 정식오픈 돼요!
                    </TextH4B>
                    <IconWrapper>
                      <SVGIcon name="blackCircleShare" />
                    </IconWrapper>
                  </FlexBetween>
                </BoxHandlerWrapper>
              </SwiperSlide>
            )
          }
          {
            /* 신청한 프코스팟 알림카드 - 참여인원 5명 이상 일때 */
            registrationsLen && (
              <SwiperSlide className="swiper-slide">
                <BoxHandlerWrapper onClick={goToShare}>
                  <FlexBetween height="92px" padding="22px">
                    <TextH4B>
                      {`[${info?.recruitingSpotRegistrations[0].placeName}]\n늘어나는 주문만큼 3,000P씩 더!`}
                    </TextH4B>
                    <IconWrapper>
                      <SVGIcon name="blackCircleShare" />
                    </IconWrapper>
                  </FlexBetween>
                </BoxHandlerWrapper>
              </SwiperSlide>
            )
          }
          {
            /* 작성중인 스팟 신청서가 있는 경우 노출 */
            unsubmitSpotRegistrationsLen && (
              <SwiperSlide className="swiper-slide">
                <BoxHandlerWrapper onClick={goToSpotStatus}>
                  <FlexBetween height="92px" padding="22px">
                    <TextH4B>{'작성중인 프코스팟 신청서 작성을\n완료하고 제출해주세요!'}</TextH4B>
                    <IconWrapper>
                      <SVGIcon name="blackCirclePencil" />
                    </IconWrapper>
                  </FlexBetween>
                </BoxHandlerWrapper>
              </SwiperSlide>
            )
          }
          {
            /* 내가 참여한 스팟 알림 카드*/
            trialRegistrationsLen && (
              <SwiperSlide className="swiper-slide">
                <BoxHandlerWrapper onClick={goToSpotStatus}>
                  <FlexBetween height="92px" padding="22px">
                    <TextH4B>{'참여한 프코스팟의\n빠른 오픈을 위해 공유해 주세요!'}</TextH4B>
                    <IconWrapper>
                      <SVGIcon name="blackCircleShare" />
                    </IconWrapper>
                  </FlexBetween>
                </BoxHandlerWrapper>
              </SwiperSlide>
            )
          }
        </TopCTASlider>
      )}
      {/* 근처 인기있는 스팟 */}
      <TextH2B padding="49px 24px 24px 24px">{popularSpotList?.title}</TextH2B>
      <SpotsSlider
        className="swiper-container"
        slidesPerView={'auto'}
        spaceBetween={15}
        speed={700}
      >
        {popularSpotList?.spots.map((list, idx) => {
          return (
            <SwiperSlide className="swiper-slide" key={idx}>
              <SpotList list={list} type="normal" />
            </SwiperSlide>
          );
        })}
      </SpotsSlider>
      {/* 신규 스팟 */}
      <TextH2B padding="49px 24px 24px 24px">{newSpotList?.title}</TextH2B>
      <SpotsSlider
        className="swiper-container"
        slidesPerView={'auto'}
        spaceBetween={15}
        speed={500}
      >
        {newSpotList?.spots.map((list, idx) => {
          return (
            <SwiperSlide className="swiper-slide" key={idx}>
              <SpotList list={list} type="normal" />
            </SwiperSlide>
          );
        })}
      </SpotsSlider>
      {/* 역세권 스팟 */}
      <TextH2B padding="49px 24px 24px 24px">{stationSpotList?.title}</TextH2B>
      <SpotsSlider
        className="swiper-container"
        slidesPerView={'auto'}
        spaceBetween={15}
        speed={500}
      >
        {stationSpotList?.spots.map((list, idx) => {
          return (
            <SwiperSlide className="swiper-slide" key={idx}>
              <SpotList list={list} type="normal" />
            </SwiperSlide>
          );
        })}
      </SpotsSlider>
      {/* 프라이빗 스팟 신청 CTA */}
      <Wrapper>
        <SpotRegistration onClick={() => goToSpotReq(FCO_SPOT_BANNER[0].type)}>
          <FlexBetween height="92px" padding="22px">
            <TextH4B color={theme.black}>{FCO_SPOT_BANNER[0].text}</TextH4B>
            <IconWrapper>
              <SVGIcon name="blackCirclePencil" />
            </IconWrapper>
          </FlexBetween>
        </SpotRegistration>
      </Wrapper>
      {/* 이벤트 중인 스팟 */}
      <TextH2B padding="0 24px 24px 24px">{eventSpotList?.title}</TextH2B>
      <EventSlider
        className="swiper-container"
        slidesPerView={'auto'}
        spaceBetween={15}
        speed={500}
      >
        {eventSpotList?.spots.map((list, idx) => {
          return (
            <SwiperSlide className="swiper-slide" key={idx}>
              <SpotList list={list} type="event" />
            </SwiperSlide>
          );
        })}
      </EventSlider>
      {/* 단골가게 스팟 */}
      <TextH2B padding="10px 24px 0 24px">오픈 진행 중인 프코스팟</TextH2B>
      <SpotOpenBannerWrapper>
        <SpotOpenBanner>스팟 오픈 베너 이미지 제작 예정</SpotOpenBanner>
      </SpotOpenBannerWrapper>
      {/* <TextH2B padding="10px 24px 0 24px">{spotRegistraions?.data.title}</TextH2B>
      <TextB2R color={theme.greyScale65} padding="8px 24px 23px 24px">
        {spotRegistraions?.data.subTitle}
      </TextB2R> */}
      <TrialSlider
        className="swiper-container"
        slidesPerView={'auto'}
        spaceBetween={15}
        speed={500}
      >
        {trialRes.map((list: any, idx) => {
          return(
            <SwiperSlide className="swiper-slide" key={idx}>
              <SpotList  list={list} type="trial" />
            </SwiperSlide>)
        })}
        {/* {spotRegistraions?.data.spotRegistrations.map((list: any, idx) => {
          return <SpotList key={idx} list={list} type="trial" />;
        })} */}
      </TrialSlider>
      {/* 퍼블릭 스팟 신청 CTA */}
      <Wrapper>
        <SpotRegistration onClick={() => goToSpotReq(FCO_SPOT_BANNER[1].type)}>
          <FlexBetween height="92px" padding="22px">
            <TextH4B color={theme.black}>{FCO_SPOT_BANNER[1].text}</TextH4B>
            <IconWrapper>
              <SVGIcon name="blackCirclePencil" />
            </IconWrapper>
          </FlexBetween>
        </SpotRegistration>
      </Wrapper>
      <BottomStory onClick={goToSpotNotice}>프코스팟 브랜딩 베너영역 + 링크</BottomStory>
      {/* 우리가게 스팟 신청 CTA */}
      <Wrapper>
        <SpotRegistration onClick={() => goToSpotReq(FCO_SPOT_BANNER[2].type)}>
          <FlexBetween height="92px" padding="22px">
            <TextH4B color={theme.black}>{FCO_SPOT_BANNER[2].text}</TextH4B>
            <IconWrapper>
              <SVGIcon name="blackCirclePencil" />
            </IconWrapper>
          </FlexBetween>
        </SpotRegistration>
      </Wrapper>
    </Container>
  );
};

const Container = styled.main`
  padding-bottom: 1px;
`;

const TopCTASlider = styled(Swiper)`
  padding: 48px 24px 0 24px;
  .swiper-slide {
    width: 100%;
  }
`;

const SpotsSlider = styled(Swiper)`
  width: auto;
  padding: 0 24px;
  .swiper-slide {
    width: 120px;
  }
`;

const EventSlider = styled(Swiper)`
  padding: 0 24px;
  .swiper-slide {
    width: 299px;
  }
`;

const TrialSlider = styled(Swiper)`
  padding: 0 24px;
  height: 224px;
  .swiper-slide {
    width: 220px;
  }
`;

const HeaderTitle = styled.div`
  span {
    color: ${theme.brandColor};
  }
`;

const RegistrationsCTAWrapper = styled.article`
  padding: 18px 24px 0 24px;
`;

const RegistrationCTA = styled.div`
  display: inline-block;
  background: ${theme.brandColor};
  padding: 4px 13px 4px 8px;
  border-radius: 24px;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background: ${theme.black};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px 0px #00000033;
`;

const BoxHandlerWrapper = styled.div`
  width: 100%;
  background: ${theme.greyScale3};
  border-radius: 8px;
  cursor: pointer;
  
  span {
    color: ${theme.brandColor};
  }
`;

const Wrapper = styled.div`
  padding: 48px 24px;
`;
const SpotRegistration = styled.div`
  width: 100%;
  background: ${theme.greyScale3};
  border-radius: 8px;
  cursor: pointer;
`;

const BottomStory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 514px;
  background: ${theme.greyScale6};
  font-weight: 700;
  cursor: pointer;
`;

const SpotOpenBannerWrapper = styled.div`
  width: 100%;
  height: 200px;
  padding: 24px 0;
`;

const SpotOpenBanner = styled.div`
  width: 100%;
  height: 100%;
  background: ${theme.greyScale3};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default SpotPage;
