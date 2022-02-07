import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH4B, TextB2R } from '@components/Shared/Text';
import { theme, homePadding, FlexBetween } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
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
  getSpotRegistrationsRecruiting,
} from '@api/spot';
import { IParamsSpots, ISpotRegistrationsResponse, ISpotsInfo } from '@model/index';
import { useQuery } from 'react-query';


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
  const [mouseMoved, setMouseMoved] = useState(false);
  const [info, setInfo] = useState<ISpotsInfo>();
  const [spotRegistraions, setSpotRegistrations] = useState<ISpotRegistrationsResponse>();
  const [spotCount, setSpotCount] = useState<number>(0);

  const registrationsLen = info&&info?.recruitingSpotRegistrations?.length > 0;
  const unsubmitSpotRegistrationsLen = info&&info?.unsubmitSpotRegistrations?.length > 0;
  const trialRegistrationsLen = info&&info?.trialSpotRegistrations?.length > 0;

  // react-query
  const { data: stationSpotList } = useQuery(
    ['spotList', 'station'],
    async () => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      const response = await getStationSpots(params);
      return response.data.data;
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  const { data: newSpotList } = useQuery(
    ['spotList', 'new'],
    async () => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      const response = await getNewSpots(params);
      return response.data.data;
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  const { data: eventSpotList } = useQuery(
    ['spotList', 'event'],
    async () => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      const response = await getSpotEvent(params);
      return response.data.data;
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  const { data: popularSpotList } = useQuery(
    ['spotList', 'popular'],
    async () => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      const response = await getSpotPopular(params);
      return response.data.data;
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  useEffect(()=> {
    const getInfoData = async() => {
      try{
        const { data }  = await getInfo();
          setSpotCount(data.data.spotCount);
          setInfo(data.data);
      }catch(err){
        console.error(err);
      };
    };
    getInfoData();

    // 단골 스팟
    const getRegistration = async() => {
      const params: IParamsSpots = {
        latitude: null,
        longitude: null,
        size: 6,
      };
      try{
        const { data } = await getSpotRegistrationsRecruiting(params);
        setSpotRegistrations(data);
      }catch(err){
        console.error(err);
      };
    };

    getRegistration();
  },[]);

  const goToShare = (e: any): void => {
    if (!mouseMoved) {
      dispatch(initBottomSheet());
      dispatch(
        setBottomSheet({
          content: <ShareSheet />,
        })
      );
    };
  };

  const goToSpotReq = (type: string) => {
    router.push({
      pathname: '/spot/spot-req',
      query: { type },
    });
  };

  const goToSpotStatus = () => {
    if (!mouseMoved) {
      router.push('/mypage/spot-status');
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

  return (
    <Container>
      <HeaderTitle>
        <TextH2B padding="24px 24px 0 24px">{`${spotCount}개의 프코스팟이\n`}<span>플린</span>님을 기다려요!</TextH2B>
      </HeaderTitle>
      <SlideWrapper {...settings}>
        {/* 청한 프코스팟 알림카드 - 참여인원 5명 미만 일때 */
          registrationsLen &&
          <BoxHandlerWrapper
            onMouseMove={() => setMouseMoved(true)}
            onMouseDown={() => setMouseMoved(false)}
            onClick={goToShare}
          >
            <FlexBetween height='92px' padding='22px'>
              <TextH4B>
                {`[${info?.recruitingSpotRegistrations[0].placeName}]\n`}
                <span>{`${5-info?.recruitingSpotRegistrations[0].recruitingCount}`}</span>
                명만 더 주문 하면 정식오픈 돼요!
              </TextH4B>
              <IconWrapper>
                <SVGIcon name="blackCircleShare" />
              </IconWrapper>
            </FlexBetween>
          </BoxHandlerWrapper>
        }
        {/* 신청한 프코스팟 알림카드 - 참여인원 5명 이상 일때 */
        registrationsLen &&
          <BoxHandlerWrapper
            onMouseMove={() => setMouseMoved(true)}
            onMouseDown={() => setMouseMoved(false)}
            onClick={goToShare}
          >
            <FlexBetween height='92px' padding='22px'>
              <TextH4B>
                {`[${info?.recruitingSpotRegistrations[0].placeName}]\n늘어나는 주문만큼 3,000P씩 더!`}
              </TextH4B>
              <IconWrapper>
                <SVGIcon name="blackCircleShare" />
              </IconWrapper>
            </FlexBetween>
          </BoxHandlerWrapper>
        }
        {/* 작성중인 스팟 신청서가 있는 경우 노출 */
         unsubmitSpotRegistrationsLen &&
            <BoxHandlerWrapper
              onMouseMove={() => setMouseMoved(true)}
              onMouseDown={() => setMouseMoved(false)}
              onClick={goToSpotStatus}
            >
              <FlexBetween height='92px' padding='22px'>
                <TextH4B>{'작성중인 프코스팟 신청서 작성을\n완료하고 제출해주세요!'}</TextH4B>
                <IconWrapper>
                  <SVGIcon name="blackCirclePencil" />
                </IconWrapper>
              </FlexBetween>
            </BoxHandlerWrapper>
        }
        {/* 내가 참여한 스팟 알림 카드*/
        trialRegistrationsLen &&  
          <BoxHandlerWrapper
            onMouseMove={() => setMouseMoved(true)}
            onMouseDown={() => setMouseMoved(false)}
            onClick={goToSpotStatus}
          >
            <FlexBetween height='92px' padding='22px'>
              <TextH4B>{'참여한 프코스팟의\n빠른 오픈을 위해 공유해 주세요!'}</TextH4B>
              <IconWrapper>
                <SVGIcon name="blackCircleShare" />
              </IconWrapper>
            </FlexBetween>
          </BoxHandlerWrapper>
        }
      </SlideWrapper>
      {/* 근처 인기있는 스팟 */}
      <TextH2B padding="49px 24px 0 24px">{popularSpotList?.title}</TextH2B>
      <SpotsSlideWrapper {...spotSettings}>
            {popularSpotList?.spots.map((list, idx)=>{
              return (
                <SpotList 
                key={idx} 
                list={list} 
                type="normal" 
              />
            )})}
      </SpotsSlideWrapper> 
      {/* 신규 스팟 */}
      <TextH2B padding="49px 24px 0 24px">{newSpotList?.title}</TextH2B>
      <SpotsSlideWrapper {...spotSettings}>
          {newSpotList?.spots.map((list, idx)=>{
            return (
              <SpotList 
              key={idx}
              list={list} 
              type="normal" 
            />
          )})}
      </SpotsSlideWrapper> 
      {/* 역세권 스팟 */}
      <TextH2B padding="49px 24px 0 24px">{stationSpotList?.title}</TextH2B>
      <SpotsSlideWrapper {...spotSettings}>
          {stationSpotList?.spots.map((list, idx)=>{
            return (
              <SpotList 
              key={idx}
              list={list} 
              type="normal" 
            />
          )})}
      </SpotsSlideWrapper> 
      {/* 프라이빗 스팟 신청 CTA */}
      <Wrapper>
        <SpotRegistration  onClick={() => goToSpotReq(FCO_SPOT_BANNER[0].type)}>
          <FlexBetween height='92px' padding='22px'>
            <TextH4B color={theme.black}>{FCO_SPOT_BANNER[0].text}</TextH4B>
            <IconWrapper>
              <SVGIcon name="blackCirclePencil" />
            </IconWrapper>
          </FlexBetween>
        </SpotRegistration>
      </Wrapper>
      {/* 이벤트 중인 스팟 */}
      <TextH2B padding='0 24px 0 24px'>{eventSpotList?.title}</TextH2B>
      <SpotListWrapper>
      {
        eventSpotList?.spots.map((list, idx)=> {
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
      {/* 단골가게 스팟 */}
      <TextH2B padding='10px 24px 0 24px'>{spotRegistraions?.data.title}</TextH2B>
      <TextB2R color={theme.greyScale65} padding="8px 24px 23px 24px">
        {spotRegistraions?.data.subTitle}
      </TextB2R>
      <SpotListWrapper>
      {
        spotRegistraions?.data.spotRegistrations.map((list, idx)=> {
          return (
            <SpotList
            key={idx}
            list={list}
            type="trial"
          />
          )
        })
      }
      </SpotListWrapper>
      {/* 퍼블릭 스팟 신청 CTA */}
      <Wrapper>
        <SpotRegistration onClick={() => goToSpotReq(FCO_SPOT_BANNER[1].type)}>
          <FlexBetween height='92px' padding='22px'>
            <TextH4B color={theme.black}>{FCO_SPOT_BANNER[1].text}</TextH4B>
            <IconWrapper>
              <SVGIcon name="blackCirclePencil" />
            </IconWrapper>
          </FlexBetween>
        </SpotRegistration>
      </Wrapper>
      <BottomStory>프코스팟 스토리</BottomStory>
      {/* 우리가게 스팟 신청 CTA */}
      <Wrapper>
        <SpotRegistration onClick={() => goToSpotReq(FCO_SPOT_BANNER[2].type)}>
          <FlexBetween height='92px' padding='22px'>
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
  // ${homePadding};
`;

const HeaderTitle = styled.div`
  span{
    color: ${theme.brandColor};
  }
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
  padding: 16px 24px 0 24px;
  .slick-slide > div {
    padding: 0 5px;
  }
`;

const SpotsSlideWrapper = styled(Slider)`
  width: 100%;
  padding: 16px 24px 0 24px;
  .slick-slide{
    width: 135px !important;
  }
`;

const SpotListWrapper = styled.section`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 24px;
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
  padding: 0 24px;
`;
const SpotRegistration = styled.div`
  width: 100%;
  background: ${theme.greyScale3};
  border-radius: 8px;
  cursor: pointer;
  margin: 48px 0;
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
