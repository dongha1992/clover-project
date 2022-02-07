import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH4B } from '@components/Shared/Text';
import { theme, homePadding, FlexBetween } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { setBottomSheet, INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';
import { SPOT_ITEMS } from '@constants/mock';
import Slider from 'react-slick';
import { useRouter } from 'next/router';
import { SpotList } from '@components/Pages/Spot';
import { 
  getNewSpots, 
  getStationSpots, 
  getSpotEvent 
} from '@api/spot';
import { IParamsSpots, ISpots, ISpotsResponse } from '@model/index';

const text = {
  mainTitle: `1,983개의 프코스팟의 \n${`회원`}님을 기다려요!`,
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
    text: '나의 회사∙학교를 프코스팟으로 만들어보세요!',
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
    text: '내 단골카페에서 샐러드 픽업하기',
    type: 'normal',
    icon: 'blackCirclePencil',
  },
];

export interface INewSpots {
  title: string;
  spots: [
    {
      id: number;
      name: string;
      images: [
        {
          url: string;
          width: number;
          height: number;
          size: number;
          main: boolean;
        }
      ]
      liked: boolean;
      likeCount: number;
      userCount: number;
      distance: number;
      distanceUnit: string;
      eventTitle?: string;
      discountRate?: number;
    }
  ]
}

// TODO : 로그인 유저별 분기처리, 단골 api 

const SpotPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mouseMoved, setMouseMoved] = useState(false);
  const [newSpot, setNewSpot] = useState<ISpots[]>([]);
  const [stationSpot, setStationSpot] = useState<ISpots[]>([]);
  const [eventSpot, setEventSpot] = useState<ISpots[]>([]);

  const getNewSpot = async() => {
    const params: IParamsSpots = {
      latitude: null,
      longitude: null,
      size: 6,
    };
    try{
      const {data} = await getNewSpots(params);
      if(data !== undefined) {
        setNewSpot(data.data.spots);
      }
    }catch (err){
      console.error(err);
    }
  };

  const getStationSpot = async() => {
    const params: IParamsSpots = {
      latitude: null,
      longitude: null,
      size: 6,
    };
    try{
      const {data} = await getStationSpots(params);
      setStationSpot(data.data.spots);
    }catch(err){
      console.error(err);
    };
  };

  const getEventSpot = async() => {
    const params: IParamsSpots = {
      latitude: null,
      longitude: null,
      size: 6,
    };
    try{
      const {data} = await getSpotEvent(params);
      setEventSpot(data.data.spots);
    }catch(err){
      console.error(err);
    };
  };

  const goToShare = (): void => {
    dispatch(INIT_BOTTOM_SHEET());
    dispatch(
      setBottomSheet({
        content: <ShareSheet />,
      })
    );
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
    dots: true,
    sliderToShow: 1,
    slidersToScroll: 1,
    speed: 500,
    centerMode: true,
    infinite: false,
    centerPadding: '20px',
  };

  useEffect(()=> {
    getNewSpot();
    getStationSpot();
    getEventSpot();
  },[])
  /* TODO 로그인 유무, 스팟이력 유무에 따른 UI 분기처리 */
  return (
    <Container>
      <TextH2B padding="24px 0 0 0">{text.mainTitle}</TextH2B>
      {/* 작성중인 스팟 신청서가 있는 경우 노출 */}
      <HandleBoxWrapper>
        <TextH4B>{text.gotoWrite}</TextH4B>
        <IconWrapper>
          <SVGIcon name="blackCirclePencil" />
        </IconWrapper>
      </HandleBoxWrapper>
      {/* 프라이빗-트라이얼 기준 내가 신청한 스팟이나 참여한 스팟이 있는경우 노출*/}
      <HandleBoxWrapper onClick={goToShare}>
        <TextH4B>{text.gotoShare}</TextH4B>
        <IconWrapper>
          <SVGIcon name="blackCircleShare" />
        </IconWrapper>
      </HandleBoxWrapper>
      {/* 스팟 신청 현황
      <SpotStatusWrapper>
        <TextH4B>{text.trialSpotOpenWait}</TextH4B>
        <FlexStart margin='25px 0 0 0'>
          <TextB2R margin='0 11px 0 0' onClick={goToSpotStatus} pointer>신청 현황 보기</TextB2R>
          <TextH5B onClick={goToShare} pointer>공유하기</TextH5B>
        </FlexStart>
      </SpotStatusWrapper> */}
      {/* <SpotList items={SPOT_ITEMS} title={text.normalTitle} type="normal" /> */}
      {/* 신규 스팟 */}
      <SpotList
        items={newSpot}
        title={newSpot.title}
        type="normal"
      />
      {/* 역세권 스팟 */}
      <SpotList
        items={stationSpot}
        title={stationSpot?.title}
        type="normal"
      />
      <SlideWrapper {...settings}>
        {FCO_SPOT_BANNER.map((item) => {
          return (
            <SpotRegister
              key={item.id}
              onMouseMove={() => setMouseMoved(true)}
              onMouseDown={() => setMouseMoved(false)}
              onClick={() => goToSpotReq(item.type)}
            >
              <FlexBetween>
                <TextH4B color={theme.black}>{item.text}</TextH4B>
                <IconWrapper>
                  <SVGIcon name={item.icon} />
                </IconWrapper>
              </FlexBetween>
            </SpotRegister>
          );
        })}
      </SlideWrapper>
      <SpotList
        items={eventSpot}
        title={eventSpot?.title}
        type="event"
        btnText="주문하기"
      />
      <SpotList
        items={SPOT_ITEMS}
        title={text.trialTitle}
        subTitle={text.trialSubTitle}
        type="trial"
        btnText="참여하기"
      />
      <SpotRegister>
        <FlexBetween>
          <TextH4B color={theme.black}>{FCO_SPOT_BANNER[1].text}</TextH4B>
          <IconWrapper>
            <SVGIcon name="blackCirclePencil" />
          </IconWrapper>
        </FlexBetween>
      </SpotRegister>
      <BottomStory>프코스팟 스토리</BottomStory>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  ${homePadding};
`;

const HandleBoxWrapper = styled.section`
  width: 100%;
  height: 68px;
  background: ${theme.greyScale3};
  margin-top: 24px;
  border-radius: 8px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const SlideWrapper = styled(Slider)`
  width: 100%;
  padding: 16px 0 0 0;
  .slick-slide > div {
    padding: 0 5px;
  }
`;

const SpotRegister = styled.div`
  width: 100%;
  padding: 16px 0 0 0;

  height: 81px;
  background: ${theme.greyScale3};
  border-radius: 8px;
  padding: 16px;
`;

const BottomStory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 514px;
  background: ${theme.greyScale6};
  margin-top: 32px;
  font-weight: 700;
`;

export default SpotPage;
