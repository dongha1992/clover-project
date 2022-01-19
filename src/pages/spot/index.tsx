import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH4B } from '@components/Shared/Text';
import { theme, homePadding, FlexBetween } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { setBottomSheet, INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/router';
import { SpotList } from '@components/Pages/Spot';
import { 
  getNewSpots, 
  getStationSpots, 
  getSpotEvent ,
  getSpotPopular,
  getInfo,
  getSpotRegistrations,
} from '@api/spot';
import { IParamsSpots, ISpotRegistrationsResponse, ISpots } from '@model/index';

export interface INormalSpots {
  title: string;
  id: number;
  name: string;
  images: [
    {
      url: string;
      width: number;
      height: number;
      size: number;
      main: boolean;
      createdAt: string;
    }
  ]
  image: {
      url: string;
      width: number;
      height: number;
      size: number;
      main: boolean;
      createdAt: string;
  }
  liked: boolean;
  likeCount: number;
  userCount: number;
  distance: number;
  distanceUnit: string;
  eventTitle?: string;
  discountRate?: number;
  recruitingCount: number;
  recruited: boolean;
  placeName: string;
};

const text = {
  gotoWrite: '작성중인 프코스팟 신청서 작성을 완료해\n주세요!',
  gotoShare:
    '[헤이그라운드 서울숲점] 정식 오픈까지\n2명! 공유해서 빠르게 오픈해요',
  normalTitle: '오늘 정심 함께 주문해요!',
  normalNewSpotTitle: '신규 스팟',
  normalFcoSpotTitle: '배송비 제로! 역세권 프코스팟',
  eventTitle: '이벤트 진행중인 스팟',
  trialTitle: '내가 자주가는 곳을 무표 픽업 스팟으로!',
  trialSubTitle: '내 주변 가게가 보인다면? 👀함께 참여해요!',
};

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
    type: 'normal',
    icon: 'blackCirclePencil',
  },
];

// TODO : 로그인 유저별 분기처리, 단골 api , 타입에러 

const SpotPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mouseMoved, setMouseMoved] = useState(false);
  const [popularSpot, setPopularSpot] = useState<ISpots>();
  const [newSpot, setNewSpot] = useState<ISpots>();
  const [stationSpot, setStationSpot] = useState<ISpots>();
  const [eventSpot, setEventSpot] = useState<ISpots>();
  const [spotRegistraions, setSpotRegistrations] = useState<ISpotRegistrationsResponse>();
  const [spotCount, setSpotCount] = useState<number>(0);

  useEffect(()=> {
    //신규 스팟
    const getNewSpot = async() => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      try{
        const {data} = await getNewSpots(params);
        setNewSpot(data.data);
      }catch (err){
        console.error(err);
      };
    };

    //근처 인기있는 스팟(점심 함께~)
    const getPopularSpot = async() => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      try{
        const {data} = await getSpotPopular(params);
        setPopularSpot(data.data);
      }catch(err){
        console.error(err);
      };
    }

    //역세권 스팟
    const getStationSpot = async() => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      try{
        const {data} = await getStationSpots(params);
        setStationSpot(data.data);
      }catch(err){
        console.error(err);
      };
    };

    //이벤트 스팟
    const getEventSpot = async() => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      try{
        const {data} = await getSpotEvent(params);
        setEventSpot(data.data);
      }catch(err){
        console.error(err);
      };
    };

    //단골 스팟
    const getRegistration = async() => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      try{
        const { data } = await getSpotRegistrations(params);
        setSpotRegistrations(data);
      }catch(err){
        console.error(err);
      };
    };

    getRegistration();
    getNewSpot();
    getStationSpot();
    getEventSpot();
    getPopularSpot();
  },[])

<<<<<<< HEAD
  const goToShare = (): void => {
    dispatch(INIT_BOTTOM_SHEET());
    dispatch(
      setBottomSheet({
        content: <ShareSheet />,
      })
    );
=======
  const goToShare = (e: any): void => {
    if (!mouseMoved) {
      dispatch(initBottomSheet());
      dispatch(
        setBottomSheet({
          content: <ShareSheet />,
          buttonTitle: '',
        })
      );
    };
>>>>>>> 820d8e9 (DEV-887 스팟 메인 api 작업, 기타 수정사항들 반영)
  };

  const goToSpotReq = (type: string) => {
    if (!mouseMoved) {
      router.push({
        pathname: '/spot/spot-req',
        query: { type },
      });
    }
  };

  
  const settings = {
    arrows: false,
    sliderToShow: 1,
    slidersToScroll: 1,
    speed: 500,
    centerMode: true,
    infinite: false,
    centerPadding: '20px',
  };

  const spotSettings = {
    arrows: false,
    sliderToShow: 3,
    slidersToScroll: 1,
    speed: 500,
    centerMode: true,
    infinite: false,
    centerPadding: '0px',
  };

  const mainTitle = () => {
    return (
      <TextH2B padding="24px 0 0 0">{`${spotCount}개의 프코스팟이\n회원님을 기다려요!`}</TextH2B>
    )
  };
  

  /* TODO 로그인 유무, 스팟이력 유무에 따른 UI 분기처리 */
  return (
    <Container>
      {mainTitle()}
      <SlideWrapper {...settings}>
        {/* 작성중인 스팟 신청서가 있는 경우 노출 */}
        <BoxHandlerWrapper>
          <FlexBetween height='92px' padding='22px'>
            <TextH4B>{text.gotoWrite}</TextH4B>
            <IconWrapper>
              <SVGIcon name="blackCirclePencil" />
            </IconWrapper>
          </FlexBetween>
        </BoxHandlerWrapper>
        {/* 프라이빗-트라이얼 기준 내가 신청한 스팟이나 참여한 스팟이 있는경우 노출*/}
        <BoxHandlerWrapper
          onMouseMove={() => setMouseMoved(true)}
          onMouseDown={() => setMouseMoved(false)}
          onClick={goToShare}
        >
          <FlexBetween height='92px' padding='22px'>
            <TextH4B>{text.gotoShare}</TextH4B>
            <IconWrapper>
              <SVGIcon name="blackCircleShare" />
            </IconWrapper>
          </FlexBetween>
        </BoxHandlerWrapper>
      </SlideWrapper>
      {/* 근처 인기있는 스팟 */}
      <TextH2B padding="49px 0 0 24px">{popularSpot?.title}</TextH2B>
      <SpotsSlideWrapper {...spotSettings}>
            {popularSpot?.spots.map((list, idx)=>{
              return (
                <SpotList 
                key={idx} 
                list={list} 
                type="normal" 
              />
            )})}
      </SpotsSlideWrapper> 
      {/* 신규 스팟 */}
      <TextH2B padding="49px 0 0 24px">{newSpot?.title}</TextH2B>
      <SpotsSlideWrapper {...spotSettings}>
          {newSpot?.spots.map((list, idx)=>{
            return (
              <SpotList 
              key={idx}
              list={list} 
              type="normal" 
            />
          )})}
      </SpotsSlideWrapper> 
      {/* 역세권 스팟 */}
      <TextH2B padding="49px 0 0 24px">{stationSpot?.title}</TextH2B>
      <SpotsSlideWrapper {...spotSettings}>
          {stationSpot?.spots.map((list, idx)=>{
            return (
              <SpotList 
              key={idx}
              list={list} 
              type="normal" 
            />
          )})}
      </SpotsSlideWrapper> 
      <SpotRegistrationWrapper  onClick={() => goToSpotReq(FCO_SPOT_BANNER[0].type)}>
        <FlexBetween height='92px' padding='22px'>
          <TextH4B color={theme.black}>{FCO_SPOT_BANNER[0].text}</TextH4B>
          <IconWrapper>
            <SVGIcon name="blackCirclePencil" />
          </IconWrapper>
        </FlexBetween>
      </SpotRegistrationWrapper>
      {/* 이벤트 중인 스팟 */}
      <TextH2B padding="49px 0 0 24px">{eventSpot?.title}</TextH2B>
      <SpotListWrapper>
      {
        eventSpot?.spots.map((list, idx)=> {
          return (
            <SpotList
            key={idx}
            list={list}
            type="event"
          />    
          )
        })
      } 
      </SpotListWrapper>
      <SpotList
        spots={spotRegistraions?.data.spotRegistrations}
        title={spotRegistraions?.data.title}
        subTitle={spotRegistraions?.data.subTitle}
        type="trial"
      />
      <SpotRegistrationWrapper onClick={() => goToSpotReq(FCO_SPOT_BANNER[1].type)}>
        <FlexBetween height='92px' padding='22px'>
          <TextH4B color={theme.black}>{FCO_SPOT_BANNER[1].text}</TextH4B>
          <IconWrapper>
            <SVGIcon name="blackCirclePencil" />
          </IconWrapper>
        </FlexBetween>
      </SpotRegistrationWrapper>
      <BottomStory>프코스팟 스토리</BottomStory>
      <SpotRegistrationWrapper onClick={() => goToSpotReq(FCO_SPOT_BANNER[2].type)}>
        <FlexBetween height='92px' padding='22px'>
          <TextH4B color={theme.black}>{FCO_SPOT_BANNER[2].text}</TextH4B>
          <IconWrapper>
            <SVGIcon name="blackCirclePencil" />
          </IconWrapper>
        </FlexBetween>
      </SpotRegistrationWrapper>
    </Container>
  );
};

const Container = styled.main`
  ${homePadding};
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

const SlideWrapper = styled(Slider)`
  width: 100%;
  padding: 16px 0 0 0;
  .slick-slide > div {
    padding: 0 5px;
  }
`;

const SpotsSlideWrapper = styled(Slider)`
  width: 100%;
  padding: 16px 0 0 0;
  .slick-slide{
    width: 135px !important;
  }
`;

const SpotListWrapper = styled.section`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

`;

const BoxHandlerWrapper = styled.div`
  width: 100%;
  background: ${theme.greyScale3};
  border-radius: 8px;
  cursor: pointer;
`;

const SpotRegistrationWrapper = styled.div`
  width: 100%;
  background: ${theme.greyScale3};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 49px;
`;


const BottomStory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 514px;
  background: ${theme.greyScale6};
  font-weight: 700;
  margin-bottom: 49px;
`;

export default SpotPage;
