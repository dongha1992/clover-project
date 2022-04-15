import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { useSelector } from 'react-redux';
import { ISpotsDetail } from '@model/index';
import { IMAGE_S3_URL } from '@constants/mock';
import { destinationForm } from '@store/destination';
import { useRouter } from 'next/router';
import { useOnLike } from 'src/query';


interface IParams {
  items: ISpotsDetail;
  onClick: any;
};

const SpotWishList = ({items, onClick}: IParams) => {
  const router = useRouter();
  const { userLocation } = useSelector(destinationForm);
  const userLocationLen = !!userLocation.emdNm?.length;
  const [like, setLike] = useState(false);
  const goToDetail = () => {
    router.push(`/spot/detail/${items?.id}`)
  };

  const onClickLike = (e: any) => {
    e.stopPropagation();
    if (!like) {
      onLike();
      setLike(!like);  
    } else {
      return;
    }
  };

  const onLike = useOnLike(items.id!, items.liked);

  return (
    <Container>
      <WishList onClick={goToDetail}>
        <StorImgWrapper>
          <ImgWrapper src={`${IMAGE_S3_URL}${items.images[0].url}`} alt="매장이미지" />
        </StorImgWrapper>
        <LocationInfoWrapper>
          <TextB2R margin="8px 0 0 0" color={theme.black}>
            {items?.name}
          </TextB2R>
          {
            // 유저 위치정보 있을때 노출
            userLocationLen &&
              <TextH5B color={theme.greyScale65}>{`${Math.round(items?.distance)}m`}</TextH5B>
          }
          <LikeWrapper onClick={ e => onClickLike(e)}>
            <SVGIcon name={!like ? 'likeRed18' : 'likeBorderGray'} />
            <TextB2R padding="4px 0 0 1px">{items.likeCount}</TextB2R>
          </LikeWrapper>
        </LocationInfoWrapper>
      </WishList>
    </Container>
  );
};

const Container = styled.div`
  width: 48%;
  max-width: 220px;
  cursor: pointer;
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
  margin-top: 4px;
`;

export default SpotWishList;
