import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextH5B, TextB2R, TextH6B } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { useSelector } from 'react-redux';
import { ISpotsDetail } from '@model/index';
import { IMAGE_S3_URL } from '@constants/mock';
import { destinationForm } from '@store/destination';
import { useRouter } from 'next/router';
import { useOnLike } from 'src/query';

interface IParams {
  items: ISpotsDetail;
  onClick: any;
}

const SpotWishList = ({ items, onClick }: IParams) => {
  const router = useRouter();
  const { userLocation } = useSelector(destinationForm);
  const userLocationLen = !!userLocation.emdNm?.length;
  const [like, setLike] = useState(false);

  const goToDetail = () => {
    router.push(`/spot/detail/${items?.id}`);
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
  // 좋아요 버튼 해제
  const onLike = useOnLike(items.id!, items.liked);

  // 날짜 커스텀
  const dt = new Date(items?.openedAt!);
  const openDate = `${dt?.getMonth()+1}/${dt.getDate()} ${dt.getHours()}시 오픈`;

  return (
    <Container>
      <WishList onClick={goToDetail}>
        <StorImgWrapper>
          <ImgWrapper src={`${IMAGE_S3_URL}${items.images[0].url}`} alt="매장이미지" />
          {
            !items.isOpened && 
              <OpenLabel>
                <TextH6B color={theme.white} padding='5px 10px 4px 10px'>{openDate}</TextH6B>
              </OpenLabel>
          }
          {
            items.isClosed &&
              <ClosedFilter><TextB2R color={theme.white}>운영종료</TextB2R></ClosedFilter>
          }
        </StorImgWrapper>
        <LocationInfoWrapper>
          <TextB2R margin="8px 0 0 0" color={theme.black}>
            {items?.name}
          </TextB2R>
          {
            // 유저 위치정보 있을때 노출
            userLocationLen && <TextH5B color={theme.greyScale65}>{`${Math.round(items?.distance)}m`}</TextH5B>
          }
          <LikeWrapper onClick={(e) => onClickLike(e)}>
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

const StorImgWrapper = styled.div`
  position: relative;
  border: 1px solid ${theme.greyScale6};
  border-radius: 8px;
`;

const OpenLabel = styled.div`
  position: absolute;
  top: 22px;
  background: ${theme.brandColor};
  border-radius: 0 4px 4px 0;
`;

const ClosedFilter = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: #24242480;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
