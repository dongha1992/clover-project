import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH5B, TextB2R } from '@components/Shared/Text';
import { theme, FlexCol, showMoreText } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { menuSelector, SET_MENU_ITEM } from '@store/menu';
import { useRouter } from 'next/router';
import Image from '@components/Shared/Image';
import { getDiscountPrice } from '@utils/menu/getMenuDisplayPrice';
import { Obj, IMenuDetails, IMenus, IOrderedMenuDetails } from '@model/index';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/ko';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { useMutation, useQueryClient } from 'react-query';
import { IMAGE_ERROR } from '@constants/menu';
import { filterSelector } from '@store/filter';
import { postCartsApi } from '@api/cart';
import { useToast } from '@hooks/useToast';

dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

/* TODO ITEM과 싱크 */

type TProps = {
  item: IOrderedMenuDetails;
  isHorizontal?: boolean;
};

const DetailItem = ({ item, isHorizontal }: TProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { categoryMenus } = useSelector(menuSelector);

  const { type } = useSelector(filterSelector);

  const { showToast } = useToast();

  // const { mutate: mutatePostMenuLike } = useMutation(
  //   async () => {
  //     const { data } = await postLikeMenus({ menuId: item.id });
  //     if (data.code === 1032) {
  //       alert(data.message);
  //     }
  //   },
  //   {
  //     onSuccess: async () => {
  //       queryClient.setQueryData(['getMenus', type], (previous: any) => {
  //         if (previous) {
  //           return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
  //         }
  //       });
  //     },
  //     onMutate: async () => {},
  //     onError: async (error: any) => {
  //       dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
  //       console.error(error);
  //     },
  //   }
  // );

  // const { mutate: mutateDeleteMenuLike } = useMutation(
  //   async () => {
  //     const { data } = await deleteLikeMenus({ menuId: item.id });
  //   },
  //   {
  //     onSuccess: async () => {
  //       queryClient.setQueryData(['getMenus', type], (previous: any) => {
  //         if (previous) {
  //           return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
  //         }
  //       });
  //     },
  //     onMutate: async () => {},
  //     onError: async (error: any) => {
  //       dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
  //       console.error(error);
  //     },
  //   }
  // );

  const { mutateAsync: mutateAddCartItem } = useMutation(
    async () => {
      const reqBody = [
        {
          menuId: item.menu.id,
          menuDetailId: item.id,
          quantity: 1,
          main: true,
        },
      ];

      const { data } = await postCartsApi(reqBody);
    },
    {
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '장바구니 담기에 실패했어요' }));
      },
      onSuccess: async () => {
        showToast({ message: '상품을 장바구니에 담았어요! 😍' });
        await queryClient.refetchQueries('getCartList');
        await queryClient.refetchQueries('getCartCount');
      },
    }
  );

  const { me } = useSelector(userForm);

  const { discount, discountedPrice } = getDiscountPrice(item);

  const goToCartSheet = (e: any) => {
    e.stopPropagation();
    mutateAddCartItem();
  };

  // const menuLikeHandler = (e: any) => {
  //   e.stopPropagation();
  //   if (!me) {
  //     goToLogin();
  //     return;
  //   }

  //   if (item.liked) {
  //     mutateDeleteMenuLike();
  //   } else {
  //     mutatePostMenuLike();
  //   }
  // };

  const goToDetail = (item: IOrderedMenuDetails) => {
    dispatch(SET_MENU_ITEM(item));
    router.push(`/menu/${item.id}`);
  };

  const goToLogin = () => {
    return dispatch(
      SET_ALERT({
        alertMessage: '로그인이 필요한 기능이에요.\n로그인 하시겠어요?',
        onSubmit: () => router.push(`/onboarding?returnPath=${encodeURIComponent(String(router.asPath))}`),
        closeBtnText: '취소',
      })
    );
  };

  return (
    <Container onClick={() => goToDetail(item)} isHorizontal={isHorizontal}>
      <ImageWrapper>
        <Image
          src={item.thumbnail.url}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          className="rounded"
        />
        <CartBtn onClick={goToCartSheet}>
          <SVGIcon name="cartBtn" />
        </CartBtn>
      </ImageWrapper>
      <FlexCol>
        <NameWrapper>
          <TextB2R margin="8px 0 0 0" width="100%" textHideMultiline>
            {item.menu.name} {item.name.trim()}
          </TextB2R>
        </NameWrapper>
        <PriceWrapper>
          {discount > 0 && (
            <TextH5B color={theme.brandColor} padding="0 4px 0 0">
              {discount}%
            </TextH5B>
          )}
          <TextH5B>{discountedPrice.toLocaleString()}원</TextH5B>
        </PriceWrapper>
        {/* <TagWrapper>
          {item.constitutionTag && item.constitutionTag !== 'NONE' && (
            <Tag margin="0px 8px 8px 0px">{TAG_MAP[item.constitutionTag]}</Tag>
          )}
        </TagWrapper> */}
      </FlexCol>
    </Container>
  );
};

const Container = styled.div<{ isHorizontal?: boolean }>`
  max-width: 220px;
  flex-direction: column;
  align-items: flex-start;
  display: inline-block;
  height: auto;
  background-color: #fff;
  ${({ isHorizontal }) => {
    if (isHorizontal) {
      return css`
        margin-bottom: 10px;
      `;
    } else {
      return css`
        width: 48%;
        margin-bottom: 16px;
        position: relative;
        max-height: 380px;
      `;
    }
  }}
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-top: 28px;
`;

const CartBtn = styled.div`
  position: absolute;
  right: 16px;
  bottom: 14px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  .rounded {
    border-radius: 8px;
  }
`;

const NameWrapper = styled.div`
  height: 26px;
  width: 100%;
`;

const TagWrapper = styled.div`
  white-space: wrap;
`;

export default React.memo(DetailItem);
