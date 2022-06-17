import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { theme, FlexCol } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import { useDispatch, useSelector } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { menuSelector, SET_MENU_ITEM } from '@store/menu';
import { CartSheet } from '@components/BottomSheet/CartSheet';
import { useRouter } from 'next/router';
import Badge from './Badge';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import { getMenuDisplayPrice } from '@utils/menu/getMenuDisplayPrice';
import getCustomDate from '@utils/destination/getCustomDate';
import { Obj, IMenuDetails, IMenus } from '@model/index';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { ReopenSheet } from '@components/BottomSheet/ReopenSheet';
import 'dayjs/locale/ko';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { deleteNotificationApi, postLikeMenus, deleteLikeMenus } from '@api/menu';
import { useMutation, useQueryClient } from 'react-query';
import { checkMenuStatus } from '@utils/menu/checkMenuStatus';

import { filterSelector } from '@store/filter';
dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

type TProps = {
  item: IMenus;
  isHorizontal?: boolean;
};

const Item = ({ item, isHorizontal }: TProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { categoryMenus } = useSelector(menuSelector);

  const {
    categoryFilters: { filter, order },
    type,
  } = useSelector(filterSelector);

  const { mutate: mutateDeleteNotification } = useMutation(
    async () => {
      const { data } = await deleteNotificationApi(item.id);
    },
    {
      onSuccess: async () => {
        queryClient.setQueryData(['getMenus', type, order, filter], (previous: any) => {
          return previous?.map((_item: IMenus) => {
            if (_item.id === item.id) {
              return { ..._item, reopenNotificationRequested: false };
            }
            return _item;
          });
        });
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알림 취소에 실패했습니다.' }));
        console.error(error);
      },
    }
  );

  /* TODO: 리팩토링 해야함, hook */

  const { mutate: mutatePostMenuLike } = useMutation(
    async () => {
      const { data } = await postLikeMenus({ menuId: item.id });
    },
    {
      onSuccess: async () => {
        queryClient.setQueryData(['getMenus', type, order, filter], (previous: any) => {
          return previous?.map((_item: IMenus) => {
            let liked, likeCount;
            if (_item.id === item.id) {
              if (item.liked) {
                liked = false;
                if (item.likeCount > 0) {
                  likeCount = item.likeCount - 1;
                } else {
                  likeCount = 0;
                }
              } else {
                liked = true;
                likeCount = item.likeCount + 1;
              }
              return { ..._item, liked, likeCount };
            }
            return _item;
          });
        });
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
        console.error(error);
      },
    }
  );

  const { mutate: mutateDeleteMenuLike } = useMutation(
    async () => {
      const { data } = await deleteLikeMenus({ menuId: item.id });
    },
    {
      onSuccess: async () => {
        queryClient.setQueryData(['getMenus', type, order, filter], (previous: any) => {
          return previous?.map((_item: IMenus) => {
            let liked, likeCount;
            if (_item.id === item.id) {
              if (item.liked) {
                liked = false;
                if (item.likeCount > 0) {
                  likeCount = item.likeCount - 1;
                } else {
                  likeCount = 0;
                }
              } else {
                liked = true;
                likeCount = item.likeCount + 1;
              }
              return { ..._item, liked, likeCount };
            }
            return _item;
          });
        });
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
        console.error(error);
      },
    }
  );

  const { me } = useSelector(userForm);
  const { menuDetails } = item;
  const { discount, discountedPrice } = getMenuDisplayPrice(menuDetails);
  const { isItemSold, checkIsBeforeThanLaunchAt } = checkMenuStatus(item);

  const goToCartSheet = (e: any) => {
    e.stopPropagation();
    if (isItemSold || checkIsBeforeThanLaunchAt.length > 0) {
      return;
    }

    dispatch(SET_MENU_ITEM(item));
    dispatch(
      SET_BOTTOM_SHEET({
        content: <CartSheet />,
      })
    );
  };

  const menuLikeHandler = (e: any) => {
    e.stopPropagation();
    if (!me) {
      goToLogin();
      return;
    }

    if (item.liked) {
      mutateDeleteMenuLike();
    } else {
      console.log('post');
      mutatePostMenuLike();
    }
  };

  const goToDetail = (item: IMenus) => {
    // if (isItemSold || checkIsBeforeThanLaunchAt.length > 0 || item.isReopen) {
    //   return;
    // }
    dispatch(SET_MENU_ITEM(item));
    router.push(`/menu/${item.id}`);
  };

  const badgeRenderer = () => {
    const badgeMap: Obj = {
      NEW: 'New',
      BEST: 'Best',
    };

    const { badgeMessage, isReopen, isSold } = item;

    if (isItemSold && !isReopen) {
      return <Badge message="일시품절" />;
    } else if (isItemSold && isReopen && checkIsBeforeThanLaunchAt.length > 0) {
      return <Badge message={`${checkIsBeforeThanLaunchAt}시 오픈`} />;
    } else if (!isReopen && badgeMessage) {
      return <Badge message={badgeMap[badgeMessage]} />;
    } else {
      return;
    }
  };

  const goToLogin = () => {
    return dispatch(
      SET_ALERT({
        alertMessage: '로그인이 필요한 기능이에요.\n로그인 하시겠어요?',
        onSubmit: () => router.push('/onboarding'),
        closeBtnText: '취소',
      })
    );
  };

  const goToReopen = (e: any) => {
    e.stopPropagation();
    if (!me) {
      goToLogin();
      return;
    }

    if (item.reopenNotificationRequested) {
      mutateDeleteNotification();
      return;
    }
    dispatch(SET_BOTTOM_SHEET({ content: <ReopenSheet menuId={item.id} /> }));
  };

  return (
    <Container onClick={() => goToDetail(item)} isHorizontal={isHorizontal}>
      <ImageWrapper>
        <Image
          src={IMAGE_S3_URL + item.thumbnail[0]?.url}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          className="rounded"
        />
        {!isItemSold && item.isReopen && (
          <ForReopen>
            <TextH6B color={theme.white}>재오픈 알림받기</TextH6B>
          </ForReopen>
        )}
        {(!isItemSold && item.isReopen) || (isItemSold && item.isReopen && checkIsBeforeThanLaunchAt.length > 0) ? (
          <ReopenBtn onClick={goToReopen}>
            <SVGIcon name={item.reopenNotificationRequested ? 'reopened' : 'reopen'} />
          </ReopenBtn>
        ) : (
          <>
            {!isItemSold && (
              <CartBtn onClick={goToCartSheet}>
                <SVGIcon name="cartBtn" />
              </CartBtn>
            )}
          </>
        )}
        {badgeRenderer()}
      </ImageWrapper>
      <FlexCol>
        <NameWrapper>
          <TextB3R margin="8px 0 0 0" width="100%" textHide>
            {item.name.trim()}
          </TextB3R>
        </NameWrapper>
        {!isItemSold && !item.isReopen && (
          <PriceWrapper>
            <TextH5B color={theme.brandColor} padding="0 4px 0 0">
              {discount}%
            </TextH5B>
            <TextH5B>{discountedPrice.toLocaleString()}원</TextH5B>
          </PriceWrapper>
        )}
        {!isHorizontal && (
          <>
            <DesWrapper>
              <TextB3R color={theme.greyScale65}>{item.description.trim().slice(0, 30)}</TextB3R>
            </DesWrapper>
            <LikeAndReview>
              <Like onClick={menuLikeHandler}>
                <SVGIcon name={item.liked ? 'like' : 'unlike'} />
                <TextB3R padding="2px 0 0 0">{item.likeCount}</TextB3R>
              </Like>
              <TextB3R>리뷰 {item.reviewCount}</TextB3R>
            </LikeAndReview>
          </>
        )}
        <TagWrapper>
          {item.constitutionTag && item.constitutionTag !== 'NONE' && (
            <Tag margin="0px 8px 8px 0px">{item.constitutionTag}</Tag>
          )}
        </TagWrapper>
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

const ForReopen = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(36, 36, 36, 0.5);
  z-index: 1;
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
  right: 16px;
  bottom: 14px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
`;

const ReopenBtn = styled.div`
  position: absolute;
  right: 16px;
  bottom: 14px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  z-index: 2;
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

export default React.memo(Item);
