import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH4B } from '@components/Shared/Text';
import { theme, homePadding } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import { setBottomSheet, initBottomSheet } from '@store/bottomSheet';
import ShareSheet from '@components/BottomSheet/ShareSheet';
import { SPOT_ITEMS } from '@constants/mock';
import Slider from 'react-slick';
import { useRouter } from 'next/router';
import SpotList from '@components/Pages/Spot/SpotList';

const text = {
  mainTitle: `1,983개의 프코스팟의 \n${`회원`}님을 기다려요!`,
  gotoWrite: '작성중인 프코스팟 신청서 작성을 완료해\n주세요!',
  gotoShare:
    '[헤이그라운드 서울숲점] 정식 오픈까지\n2명! 공유해서 빠르게 오픈해요',
  normalTitle: '오늘 정심 함께 주문해요!',
  normalNewSpotTitle: '신규 스팟',
  normalFcoSpotTitle: '배송비 제로! 역세권 프코스팟',
  eventTitle: '이벤트 진행중인 스팟',
  trialTitle: '정식 오픈을 기다리는 트라이얼스팟',
  trialSubTitle: '트라이얼 스팟 함께 주문하고 300포인트 받아요',
};

const FCO_SPOT_BANNER = [
  {
    id: 1,
    text: '우리회사로 샐러드 당일 무료배송 받기',
    type: 'private',
  },
  {
    id: 2,
    text: '우리 가게를 프코스팟으로 만들고\n더 많은 고객들을 만나보세요!',
    type: 'public',
  },
  {
    id: 3,
    text: '내 단골카페에서 샐러드 픽업하기',
    type: 'normal',
  },
];

const SpotPage = () => {
  const [mouseMoved, setMouseMoved] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const goToShare = (): void => {
    dispatch(initBottomSheet());
    dispatch(
      setBottomSheet({
        content: <ShareSheet />,
        buttonTitle: '',
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

  const isLogin = (isLogin: boolean) => {
    if (isLogin) {
      return true;
    }
    return false;
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

  /* TODO 로그인 유무, 스팟이력 유무에 따른 UI 분기처리 */
  return (
    <Container>
      <TextH2B padding="24px 0 0 0">{text.mainTitle}</TextH2B>
      {isLogin(true) && (
        <HandleBoxWrapper>
          <TextH4B>{text.gotoWrite}</TextH4B>
          <ShareIconWrapper>
            <SVGIcon name="download" />
          </ShareIconWrapper>
        </HandleBoxWrapper>
      )}
      {isLogin(true) && (
        <HandleBoxWrapper onClick={goToShare}>
          <TextH4B>{text.gotoShare}</TextH4B>
          <ShareIconWrapper>
            <SVGIcon name="share" />
          </ShareIconWrapper>
        </HandleBoxWrapper>
      )}
      <SpotList items={SPOT_ITEMS} title={text.normalTitle} type="normal" />
      <SpotList
        items={SPOT_ITEMS}
        title={text.normalNewSpotTitle}
        type="normal"
      />
      <SpotList
        items={SPOT_ITEMS}
        title={text.normalFcoSpotTitle}
        type="normal"
      />
      <SlideWrapper {...settings}>
        {FCO_SPOT_BANNER.map((item) => {
          return (
            <MidBannerWrapper
              key={item.id}
              onMouseMove={() => setMouseMoved(true)}
              onMouseDown={() => setMouseMoved(false)}
              onClick={() => goToSpotReq(item.type)}
            >
              <TextH4B color={theme.black}>{item.text}</TextH4B>
            </MidBannerWrapper>
          );
        })}
      </SlideWrapper>
      <SpotList items={SPOT_ITEMS} title={text.eventTitle} type="event" />
      <SpotList
        items={SPOT_ITEMS}
        title={text.trialTitle}
        subTitle={text.trialSubTitle}
        type="trial"
      />
      {/* <Banner>
          <TextH4B color={theme.black}>카페 사장님들! 프코스팟으로 고객 유치하세요!</TextH4B>
      </Banner> */}
      <BottomStory>프코스팟 스토리</BottomStory>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  ${homePadding};
`;

const HandleBoxWrapper = styled.div`
  width: 100%;
  height: 68px;
  background: ${theme.greyScale3};
  margin-top: 24px;
  border-radius: 8px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ShareIconWrapper = styled.div``;

const SlideWrapper = styled(Slider)`
  width: 100%;
  padding: 16px 0 0 0;
  .slick-slide > div {
    padding: 0 5px;
  }
`;

const MidBannerWrapper = styled.div`
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
