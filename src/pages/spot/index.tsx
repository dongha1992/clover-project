import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {TextH2B, TextH4B} from '@components/Text';
import SpotItems from './spot-item-list';
import {theme, textH6} from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';

const SPOT_ITEMS = [
  {
    id: 0,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 10,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
  },
  {
    id: 1,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 12,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
  },
  {
    id: 2,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 31,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
  },
  {
    id: 3,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 31,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
  },
  {
    id: 4,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 23,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
  },
  {
    id: 5,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 21,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
  },
];

const text =  {
  mainTitle : `1,983개의 프코스팟의 \n${`회원`}님을 기다려요!`,
  gotoWrite: '작성중인 프코스팟 신청서 작성을 완료해\n주세요!',
  gotoShare: '[헤이그라운드 서울숲점] 정식 오픈까지\n2명! 공유해서 빠르게 오픈해요',
  normalTitle: '오늘 정심 함께 주문해요!',
  normalNewSpotTitle: '신규 스팟',
  normalFcoSpotTitle: '배송비 제로! 역세권 프코스팟',
  eventTitle: '이벤트 진행중인 스팟',
  trialTitle: '정식 오픈을 기다리는 트라이얼스팟',
  trialSubTitle: '트라이얼 스팟 함께 주문하고 300포인트 받아요',
};

function spot () {

  const isLogin = (isLogin: boolean) => {
    if(isLogin){
      return true;
    }
    return false;
  };

  return (
    <Container>
      <TextH2B padding='24px 0 0 0'>
        {text.mainTitle}
      </TextH2B>
      {
        isLogin(false) ? 
        <HandleBoxWrapper>
          <TextH4B>{text.gotoWrite}</TextH4B>
          <ShareIconWrapper>
            <SVGIcon name='share' />
          </ShareIconWrapper>
        </HandleBoxWrapper>
        :
        <HandleBoxWrapper>
          <TextH4B>{text.gotoShare}</TextH4B>
          <ShareIconWrapper>
            <SVGIcon name='share' />
          </ShareIconWrapper>
        </HandleBoxWrapper>
      }
      <SpotItems items={SPOT_ITEMS} title={text.normalTitle} type='normal' />
      <SpotItems items={SPOT_ITEMS} title={text.normalNewSpotTitle} type='normal' />
      <SpotItems items={SPOT_ITEMS} title={text.normalFcoSpotTitle} type='normal' />
      <Banner>
          <TextH4B color={theme.black}>우리회사로 샐러드 무료배송 하기</TextH4B>
      </Banner>
      <SpotItems items={SPOT_ITEMS} title={text.eventTitle} type='event' />
      <SpotItems items={SPOT_ITEMS} title={text.trialTitle} subTitle={text.trialSubTitle} type='trial' />
      <Banner>
          <TextH4B color={theme.black}>카페 사장님들! 프코스팟으로 고객 유치하세요!</TextH4B>
      </Banner>
      <BottomStory>
        프코스팟 스토리
      </BottomStory>
    </Container>
  )
}

const Container = styled.main`
  width: 100%;
  padding: 24px;
`

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
`

const ShareIconWrapper = styled.div``

const ItemListRowWrapper = styled.div`
  width: auto;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 48px;
  margin-top: 48px;
`
export const ItemListRow = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  > div {
    padding-right: 10px;
    width: 194px;
  }
`

const Banner = styled.div`
  width: 100%;
  height: 96px;
  background: ${theme.greyScale6};
  display: flex;
  align-items: center;
  justify-content: center;
`

const BottomStory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 514px;
  background: ${theme.greyScale6};
  margin-top: 32px;
  font-weight: 700;
`

export default spot;
