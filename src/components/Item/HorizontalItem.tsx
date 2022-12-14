import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { theme, FlexCol } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_MENU_ITEM } from '@store/menu';
import { CartSheet } from '@components/BottomSheet/CartSheet';
import { useRouter } from 'next/router';
import Image from '@components/Shared/Image';
import { getMenuDisplayPrice } from '@utils/menu/getMenuDisplayPrice';

type TProps = {
  item: any;
};

const HorizontalItem = ({ item }: TProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { menuDetails } = item;
  const { discount, price } = getMenuDisplayPrice(menuDetails ?? [{}]);

  const goToCartSheet = (e: any) => {
    e.stopPropagation();
    dispatch(SET_MENU_ITEM(item));
    dispatch(
      SET_BOTTOM_SHEET({
        content: <CartSheet menuItem={item} />,
      })
    );
  };

  const goToDetail = (id: number) => {
    router.push(`/menu/${id}`);
  };

  return (
    <Container onClick={() => goToDetail(item.id)}>
      <ImageWrapper>
        <Image
          src={item.thumbnail}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          className="rounded"
        />
        <CartBtn onClick={goToCartSheet}>
          <SVGIcon name="cart" />
        </CartBtn>
        {item.badgeMessage && (
          <NewTagWrapper>
            <TextH6B color={theme.white}>{item.badgeMessage}</TextH6B>
          </NewTagWrapper>
        )}
      </ImageWrapper>
      <FlexCol>
        <NameWrapper>
          <TextB3R margin="8px 0 0 0" width="100%" textHideMultiline>
            {item.name}
          </TextB3R>
        </NameWrapper>
        <PriceWrapper>
          {discount > 0 && (
            <TextH5B color={theme.brandColor} padding="0 4px 0 0">
              {discount}%
            </TextH5B>
          )}
          <TextH5B>{price}원</TextH5B>
        </PriceWrapper>
        <TagWrapper>
          {item.constitutionTag && item.constitutionTag !== 'NONE' && (
            <Tag margin="0px 8px 8px 0px">{item.constitutionTag}</Tag>
          )}
        </TagWrapper>
      </FlexCol>
    </Container>
  );
};

const Container = styled.div`
  max-width: 220px;
  height: auto;
  background-color: #fff;
  margin-bottom: 10px;
  display: inline-block;
  flex-direction: column;
  align-items: flex-start;
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

const NewTagWrapper = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  top: 10%;
  background-color: ${theme.brandColor};
  padding: 4px 8px;
`;

const NameWrapper = styled.div`
  width: 100%;
  height: 35px;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin: 8px 0;
`;

const TagWrapper = styled.div`
  white-space: wrap;
`;

export default HorizontalItem;
