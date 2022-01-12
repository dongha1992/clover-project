import React from 'react';
import styled from 'styled-components';
import { SPOT_ITEMS } from '@constants/mock';
import { theme } from '@styles/theme';
import { TextB3R, TextH6B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';

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
