/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { TextH2B, TextH4B, TextB2R, TextH6B, TextH5B } from '@components/Shared/Text';
import { theme, FlexBetween, FlexCenter, FlexCol } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';
import { useRouter } from 'next/router';
import { SpotList } from '@components/Pages/Spot';
import { getNewSpots, getSpotEvent, getSpotPopular, getSpotInfo, getSpotRegistrationsRecruiting } from '@api/spot';
import { IParamsSpots, ISpotsInfo } from '@model/index';
import { useQuery } from 'react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSelector } from 'react-redux';
import { userForm } from '@store/user';
import { spotSelector, SET_SPOT_INFO } from '@store/spot';
import { destinationForm } from '@store/destination';
import { SET_ALERT } from '@store/alert';
import { getAddressFromLonLat } from '@api/location';
import { getComputeDistance } from '@utils/spot';
import { IMAGE_S3_DEV_URL } from '@constants/mock';
import { Button } from '@components/Shared/Button';

const FCO_SPOT_BANNER = [
  {
    id: 1,
    text: '나의 회사∙학교를 프코스팟으로\n만들어보세요!',
    type: 'PRIVATE',
    icon: 'blackCirclePencil',
  },
  {
    id: 2,
    text: '내가 자주가는 장소를 프코스팟으로\n만들어보세요!',
    type: 'PUBLIC',
    icon: 'blackCirclePencil',
  },
  {
    id: 3,
    text: '우리 가게를 프코스팟으로 만들고\n더 많은 고객들을 만나보세요!',
    type: 'OWNER',
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
  const [spotCount, setSpotCount] = useState<number>(0);

  const latLen = spotsPosition.latitude !== null;
  const lonLen = spotsPosition.longitude !== null;
  const uerLocationInfo = !!userLocation.emdNm?.length;

  useEffect(() => {
    // 스팟 정보 조회
    const getSpotInfoData = async () => {
      try {
        const { data } = await getSpotInfo();
        setSpotCount(data.data.spotCount);
        setInfo(data.data);
        dispatch(SET_SPOT_INFO(data.data));
      } catch (err) {
        console.error(err);
      }
    };
    getSpotInfoData();
  }, [spotsPosition]);

  const params: IParamsSpots = {
    latitude: latLen ? Number(spotsPosition.latitude) : 37.50101118367814,
    longitude: lonLen ? Number(spotsPosition.longitude) : 127.03525895821902,
    size: 6,
  };

  // react-query

  // 신규 프코스팟
  const { data: newSpotList, isLoading: isLoadingNew } = useQuery(
    ['spotList', 'NEW'],
    async () => {
      const response = await getNewSpots(params);
      const listSort = response.data.data.spots.sort((a, b) => a.distance - b.distance);
      return {
        data: response.data.data,
        spotList: listSort,
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 이벤트 진행 중인 프코스팟
  const { data: eventSpotList, isLoading: isLoadingEvent } = useQuery(
    ['spotList', 'EVENT'],
    async () => {
      const response = await getSpotEvent(params);
      const listSort = response.data.data.spots?.sort((a, b) => a.distance - b.distance);
      return  {
        data: response.data.data,
        spotList: listSort,
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 오늘 점심 함계 주문해요 (근처 인기있는 프코스팟)
  const { data: popularSpotList, isLoading: isLoadingPopular } = useQuery(
    ['spotList', 'POPULAR'],
    async () => {
      const response = await getSpotPopular(params);
      const listSort = response.data.data.spots?.sort((a, b) => a.distance - b.distance);
      return {
        data: response.data.data,
        spotList: listSort,
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 단골가게 프코스팟 (퍼블릭)
  const { data: trialSpotList, isLoading: isLoadingTrial } = useQuery(
    ['trialSpot'],
    async () => {
      const response = await getSpotRegistrationsRecruiting(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const goToShare = (e: any): void => {
    // dispatch(initBottomSheet());
    dispatch(
      SET_BOTTOM_SHEET({
        content: <ShareSheet />,
      })
    );
  };

  const goToSpotReq = (type: string): void => {
    switch (type) {
      case 'PRIVATE':
        {
          if (isLoginSuccess) {
            // 로그인 o
            if (info?.canPrivateSpotRegistration) {
              // 프라이빗 스팟 신청 진행중인게 1개 미민안 경우 true (0개) - 신청 가능
              // 프라이빗 신청 제한: 1개 - 신청 불가
              router.push({
                pathname: '/spot/join/main',
                query: { type },
              });
            } else {
              dispatch(
                SET_ALERT({
                  alertMessage: `이미 진행 중인 신청이 있어요!\n완료 후 새롭게 신청해 주세요.`,
                  submitBtnText: '확인',
                })
              );
            }
          } else {
            router.push({
              pathname: '/spot/join/main',
              query: { type },
            });
          }
        }
        break;
      case 'PUBLIC':
        {
          if (isLoginSuccess) {
            // 로그인 o
            if (info?.canPublicSpotRegistraion) {
              // 퍼블릭 스팟 신청 진행중인게 3개 미민안 경우 true (0~2개) - 신청 가능
              // 퍼블릭(단골가게) 스팟 신청 제한: 3개 - 신청 불가
              router.push({
                pathname: '/spot/join/main',
                query: { type },
              });
            } else {
              dispatch(
                SET_ALERT({
                  alertMessage: `이미 진행 중인 신청이 있어요!\n완료 후 새롭게 신청해 주세요.`,
                  submitBtnText: '확인',
                })
              );
            }
          } else {
            router.push({
              pathname: '/spot/join/main',
              query: { type },
            });
          }
        }
        break;
      case 'OWNER':
        {
          if (isLoginSuccess) {
            // 로그인 o
            if (info?.canOwnerSpotRegistraion) {
              // 우리가게(owner) 스팟 신청 진행중인게 1개 미민안 경우 true (0개) - 신청 가능
              // 우리가게 스팟 신청 제한: 1개 - 신청 불가
              router.push({
                pathname: '/spot/join/main',
                query: { type },
              });
            } else {
              dispatch(
                SET_ALERT({
                  alertMessage: `이미 진행 중인 신청이 있어요!\n완료 후 새롭게 신청해 주세요.`,
                  submitBtnText: '확인',
                })
              );
            }
          } else {
            router.push({
              pathname: '/spot/join/main',
              query: { type },
            });
          }
        }
        break;
    }
  };

  const goToRegiList = (): void => {
    router.push('/spot/join');
  };

  const goToSpotNotice = (): void => {
    router.push('/spot/notice');
  };

  const goToLocation = (): void => {
    router.push({
      pathname: '/location',
      query: { isSpot: true },
    });
  };

  const isLoading = isLoadingNew && isLoadingEvent && isLoadingPopular && isLoadingTrial;

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <Container>
      <HeaderTitle>
        <TextH2B padding="24px 24px 0 24px">
          {`${spotCount.toLocaleString()}개의 프코스팟이\n`}
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
        <TopCTASlider className="swiper-container" slidesPerView={'auto'} spaceBetween={15} speed={500}>
          {
            /* 청한 프코스팟 알림카드 - 참여인원 5명 미만 일때 */
            info?.trialSpotRegistration?.trialUserCount! < 5 && (
              <SwiperSlide className="swiper-slide">
                <BoxHandlerWrapper onClick={goToShare}>
                  <FlexBetween height="92px" padding="22px">
                    <TextH4B>
                      {`[${info?.trialSpotRegistration?.placeName}]\n`}
                      <span>{`${
                        info?.trialSpotRegistration?.trialTargetUserCount! -
                        info?.trialSpotRegistration?.trialUserCount!
                      }`}</span>
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
            info?.trialSpotRegistration?.trialUserCount! >= 5 && (
              <SwiperSlide className="swiper-slide">
                <BoxHandlerWrapper onClick={goToShare}>
                  <FlexBetween height="92px" padding="22px">
                    <TextH4B>{`[${info?.trialSpotRegistration?.placeName}]\n늘어나는 주문만큼 3,000P씩 더!`}</TextH4B>
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
      {
        // 근처 인기있는 스팟 & 신규 스팟
        // 오늘 점심 함께 주문해요.
        popularSpotList?.spotList?.length! > 0 && newSpotList?.spotList?.length! > 0 ? (
          <>
            <TextH2B padding="24px 24px 24px 24px">{popularSpotList?.data.title}</TextH2B>
            <SpotsSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={25} speed={700}>
              {popularSpotList?.spotList.map((list, idx) => {
                return (
                  <SwiperSlide className="swiper-slide" key={idx}>
                    <SpotList list={list} type="normal" />
                  </SwiperSlide>
                );
              })}
            </SpotsSlider>
            <TextH2B padding="49px 24px 24px 24px">{newSpotList?.data.title}</TextH2B>
            <SpotsSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={25} speed={500}>
              {newSpotList?.spotList.map((list, idx) => {
                return (
                  <SwiperSlide className="swiper-slide" key={idx}>
                    <SpotList list={list} type="normal" />
                  </SwiperSlide>
                );
              })}
            </SpotsSlider>
          </>
        ) : (
          <EmptyySpotListWrapper>
            <FlexCenter>
              <TextB2R center color={theme.greyScale65}>
                {'주변에 사용 가능한 프코스팟이 없어요. 😭\n(이용 가능 지역: 서울 및 경기도 일부)'}
              </TextB2R>
            </FlexCenter>
            <FlexCenter>
              <Button
                backgroundColor={theme.white}
                color={theme.black}
                width="111px"
                height="38px"
                margin='16px 0 0 0'
                border
                onClick={goToLocation}
              >
                위치 변경하기
              </Button>
            </FlexCenter>
          </EmptyySpotListWrapper>
        )
      }
      {
        //프라이빗 스팟 신청 CTA
        popularSpotList?.spotList?.length! > 0 && newSpotList?.spotList?.length! > 0 && (
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
        )
      }
      {
        // 이벤트 중인 스팟
        eventSpotList?.spotList?.length! > 0 && (
          <>
            <TextH2B padding="0 24px 24px 24px">{eventSpotList?.data.title}</TextH2B>
            <EventSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={25} speed={500}>
              {eventSpotList?.spotList.map((list, idx) => {
                return (
                  <SwiperSlide className="swiper-slide" key={idx}>
                    <SpotList list={list} type="event" />
                  </SwiperSlide>
                );
              })}
            </EventSlider>
          </>
        )
      }
      {
      // 오픈 진행중인 스팟 (단골가게)
      uerLocationInfo &&
      trialSpotList?.spotRegistrations?.length! > 0 && (
        <>
          <TextH2B padding="10px 24px 0 24px">오픈 진행 중인 프코스팟</TextH2B>
          <SpotOpenBannerWrapper>
            <ImgBanner src={`${IMAGE_S3_DEV_URL}/img_banner_fco_open.png`} />
          </SpotOpenBannerWrapper>
          <TrialSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={15} speed={500}>
            {trialSpotList?.spotRegistrations.map((list, idx) => {
              return (
                <SwiperSlide className="swiper-slide" key={idx}>
                  <SpotList list={list} type="trial" />
                </SwiperSlide>
              );
            })}
          </TrialSlider>
        </>
      )
      }
      {
        //퍼블릭 스팟 신청 CTA
        popularSpotList?.spotList?.length! > 0 && newSpotList?.spotList?.length! > 0 ? (
          <>
            <Wrapper type="PUBLIC">
              <SpotRegistration onClick={() => goToSpotReq(FCO_SPOT_BANNER[1].type)}>
                <FlexBetween height="92px" padding="22px">
                  <TextH4B color={theme.black}>{FCO_SPOT_BANNER[1].text}</TextH4B>
                  <IconWrapper>
                    <SVGIcon name="blackCirclePencil" />
                  </IconWrapper>
                </FlexBetween>
              </SpotRegistration>
            </Wrapper>
            <StoryContentsWrapper onClick={goToSpotNotice}>
              <ImgStory src={`${IMAGE_S3_DEV_URL}/img_banner_fco_info.jpg`} />
            </StoryContentsWrapper>
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
          </>
        ) : (
          <StoryContentsWrapper>
            <EmptyImg src={`${IMAGE_S3_DEV_URL}/img_banner_fco_info.jpg`} />
          </StoryContentsWrapper>
        )
      }
    </Container>
  );
};

const Container = styled.main`
  padding-bottom: 1px;
`;

const TopCTASlider = styled(Swiper)`
  padding: 0 24px 0 24px;
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

const EmptyySpotListWrapper = styled.section`
  padding: 64px 0;
`;

const TrialSlider = styled(Swiper)`
  padding: 0 24px;
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
  padding: 18px 24px 24px 24px;
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

const Wrapper = styled.div<{ type?: string }>`
  padding: 48px 24px;
  ${({ type }) => {
    if (type === 'PUBLIC') {
      return css`
        padding: 24px 24px 48px 24px;
      `;
    }
  }}
`;
const SpotRegistration = styled.div`
  width: 100%;
  background: ${theme.greyScale3};
  border-radius: 8px;
  cursor: pointer;
`;


const SpotOpenBannerWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px 0;
`;

const ImgBanner = styled.img`
  width: 100%;
  height: 100%;
`;

const StoryContentsWrapper = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const ImgStory = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const EmptyImg = styled.img`
  width: 100%;
  height: 100%;
`;

export default SpotPage;
