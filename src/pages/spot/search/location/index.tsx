import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { theme, FlexEnd } from '@styles/theme';
import {TextH6B} from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import SVGIcon from '@utils/SVGIcon';
import SpotItem from '@components/Pages/Spot/SpotItem';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';
import Slider from 'react-slick';


const SPOT_RECOMMEND_LIST = [
  {
     id:1,
     name:"헤이그라운드 서울숲점",
     address:"서울 성동구 왕십리로 115 10층",
     meter:121,
     type:"픽업",
     availableTime:"12:00-12:30 / 15:30-18:00",
     spaceType: ["프라이빗", '5% 할인중'],
     url: "https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg"
  },
  {
     id:2,
     name:"헤이그라운드 성수점",
     address:"서울 성동구 왕십리로 115 10층",
     meter:11,
     type:"픽업",
     availableTime:"12:00-12:30 / 15:30-18:00",
     spaceType:"퍼블릭",
     url:"https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg"
  },
  {
     id:3,
     name:"헤이그라운드 성수시작점",
     address:"서울 성동구 왕십리로 115 10층 ㅁㄴㅇㅁㄴ",
     meter:11,
     type:"픽업",
     availableTime:"12:00-12:30 / 15:30-18:00",
     spaceType: "트라이얼",
     url:"https://image.ajunews.com/content/image/2020/08/29/20200829141039628211.jpg"
  }
]

const SpotLocationPage = ():ReactElement => {
  const router = useRouter();

  const goToSpot = ():void => {};
    
  const setting = {
    arrows: false,
    dots: false,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: false,
    centerPadding: '30px',
  }

  return(
    <Container>
      <Wrapper>
        <TextInput
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
        //   keyPressHandler={getSearchResult}
        //   eventHandler={changeInputHandler}
        //   ref={inputRef}
        />
        <FlexEnd padding='0 0 24px 0' margin='16px 0 0 0'>
          <SVGIcon name='locationBlack' />
          <TextH6B margin='0 0 0 2px' padding='3px 0 0 0'>현 위치로 설정하기</TextH6B>
        </FlexEnd>
      </Wrapper>
      <GoogleMapWrapper>
        MAP
        <FooterSpotListWrapper>
          <SpotListSlider {...setting}>
            {SPOT_RECOMMEND_LIST.map((item: any, index) => (
              <SpotItem item={item} key={index} onClick={goToSpot} mapList />
            ))}
          </SpotListSlider>

        </FooterSpotListWrapper>
      </GoogleMapWrapper>
    </Container>
  )
};

const Container = styled.main`
  position: relative;
`

const Wrapper = styled.div`
  padding: 8px 24px;
`;

const GoogleMapWrapper = styled.section`
  width: 100%;
  background: ${theme.greyScale15};
`
const SpotListSlider = styled(Slider)`
  width: 100%;
  padding: 16px 0;
  .slick-slide>div {padding: 0 5px;}
`

const FooterSpotListWrapper = styled.section`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  z-index: 10;
`;

export default SpotLocationPage;