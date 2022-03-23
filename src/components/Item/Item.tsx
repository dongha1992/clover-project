import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { theme, FlexCol } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_CART_SHEET_OBJ } from '@store/cart';
import { CartSheet } from '@components/BottomSheet/CartSheet';
import { useRouter } from 'next/router';
import Badge from './Badge';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import { getMenuDisplayPrice } from '@utils/getMenuDisplayPrice';

type TProps = {
  item: any;
  isQuick?: boolean;
};

const Item = ({ item, isQuick = false }: TProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { menuDetails } = item;

  const { discount, discountedPrice } = getMenuDisplayPrice(menuDetails);

  const goToCartSheet = (e: any) => {
    e.stopPropagation();
    console.log(item, 'item');
    dispatch(SET_CART_SHEET_OBJ(item));
    dispatch(
      SET_BOTTOM_SHEET({
        content: <CartSheet />,
      })
    );
  };

  const goToDetail = (menuId: number) => {
    router.push(`/menu/${menuId}`);
  };

  return (
    <Container onClick={() => goToDetail(item.id)}>
      <ImageWrapper>
        <Image
          src={IMAGE_S3_URL + item.thumbnail}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          className="rounded"
        />
        {item.reopen && (
          <ForReopen>
            <TextH6B color={theme.white}>재오픈 알림받기</TextH6B>
          </ForReopen>
        )}

        <CartBtn onClick={goToCartSheet}>
          <SVGIcon name="cart" />
        </CartBtn>
        {item.badgeMessage && <Badge status={item.badgeMessage} />}
      </ImageWrapper>
      <FlexCol>
        <NameWrapper>
          <TextB3R margin="8px 0 0 0" width="100%" textHide>
            {item.name.trim()}
          </TextB3R>
        </NameWrapper>
        <PriceWrapper>
          <TextH5B color={theme.brandColor} padding="0 4px 0 0">
            {discount}%
          </TextH5B>
          <TextH5B>{discountedPrice}원</TextH5B>
        </PriceWrapper>
        <DesWrapper>
          <TextB3R color={theme.greyScale65}>{item.description.trim().slice(0, 30)}</TextB3R>
        </DesWrapper>
        {!isQuick && (
          <>
            <LikeAndReview>
              <Like>
                <SVGIcon name="like" />
                <TextB3R>{item.likeCount}</TextB3R>
              </Like>
              <TextB3R>리뷰 {item.reviewCount}</TextB3R>
            </LikeAndReview>
            <TagWrapper>{item.tag && <Tag margin="0px 8px 8px 0px">{item.tag}</Tag>}</TagWrapper>
          </>
        )}
      </FlexCol>
    </Container>
  );
};

const Container = styled.div`
  max-width: 220px;
  width: 48%;
  height: auto;
  background-color: #fff;
  margin-bottom: 16px;
  display: inline-block;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  height: auto;
  max-height: 380px;
`;

const ForReopen = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(36, 36, 36, 0.5);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const DesWrapper = styled.div`
  width: 100%;
  height: 38px;
  overflow: hidden;
`;

const CartBtn = styled.div`
  position: absolute;
  right: 8px;
  bottom: 12px;
  border-radius: 50%;
  background-color: white;
  width: 32px;
  height: 32px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.2);
  > svg {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 100%;
    width: 16px;
    height: 16px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  .rounded {
    border-radius: 8px;
  }
`;

const NameWrapper = styled.div`
  height: 26px;
  width: 100%;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const LikeAndReview = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0px;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
`;

const TagWrapper = styled.div`
  white-space: wrap;
`;

export default Item;
