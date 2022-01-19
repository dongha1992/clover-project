import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextB3R, TextH6B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';

export const SPOT_ITEMS = [
  {
    id: 0,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 10,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
    detail: {},
  },
  {
    id: 1,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 12,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
    detail: {},
  },
  {
    id: 2,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 31,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
    detail: {},
  },
  {
    id: 3,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 31,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
    detail: {},
  },
  {
    id: 4,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 23,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
    detail: {},
  },
  {
    id: 5,
    img: 'https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg',
    users: 21,
    distance: 125,
    location: '헤이그라운드 서울숲점',
    desc: '샐러드 받고 300포인트도 받자',
    like: 10,
    detail: {},
  },
];


const SpotWishList = () => {
  return (
    <Container>
      <WishListWrapper>
        {SPOT_ITEMS.map((item: any, index: number) => {
          return (
            <WishList onClick={() => {}} key={index}>
              <StorImgWrapper>
                <ImgWrapper src={item.img} alt="매장이미지" />
              </StorImgWrapper>
              <LocationInfoWrapper>
                <TextB3R margin="8px 0 0 0" color={theme.black}>
                  {item.location}
                </TextB3R>
                <TextH6B
                  color={theme.greyScale65}
                >{`${item.distance}m`}</TextH6B>
                <LikeWrapper>
                  <SVGIcon name="likeRed" />
                  {item.like}
                </LikeWrapper>
              </LocationInfoWrapper>
            </WishList>
          );
        })}
      </WishListWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-top: 72px;
`;

export const WishListWrapper = styled.section`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  cursor: pointer;

  ${({ theme }) => theme.desktop`
    > div {
      width: 193px;
    }
  `};

  ${({ theme }) => theme.mobile`
    > div {
      width: 150px;
    }
  `};
`;

const WishList = styled.div`
  margin-bottom: 24px;
`;

const StorImgWrapper = styled.div``;

const ImgWrapper = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const LocationInfoWrapper = styled.div`
  margin-top: 8px;
`;

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

export default SpotWishList;
