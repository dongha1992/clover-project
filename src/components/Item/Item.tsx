import React from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH5B, TextH6B, TextB2R } from '@components/Shared/Text';
import { theme, FlexCol, showMoreText } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import { useDispatch, useSelector } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { menuSelector, SET_MENU_ITEM } from '@store/menu';
import { CartSheet } from '@components/BottomSheet/CartSheet';
import { useRouter } from 'next/router';
import Badge from './Badge';
import { TAG_MAP } from '@constants/menu';
import Image from '@components/Shared/Image';
import { getMenuDisplayPrice } from '@utils/menu/getMenuDisplayPrice';
import { Obj, IMenus } from '@model/index';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/ko';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { deleteNotificationApi, postLikeMenus, deleteLikeMenus } from '@api/menu';
import { useMutation, useQueryClient } from 'react-query';
import { checkMenuStatus } from '@utils/menu/checkMenuStatus';
import { filterSelector } from '@store/filter';
import { onMenuLikes } from '@queries/menu';
import { useToast } from '@hooks/useToast';

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
  const { showToast } = useToast();
  const { type } = useSelector(filterSelector);

  const { mutate: mutateDeleteNotification } = useMutation(
    async () => {
      const { data } = await deleteNotificationApi(item.id);
    },

    {
      onSuccess: async () => {
        queryClient.setQueryData(['getMenus', type], (previous: any) => {
          return previous?.map((_item: IMenus) => {
            if (_item.id === item.id) {
              return { ..._item, reopenNotificationRequested: false };
            }
            return _item;
          });
        });
        queryClient.setQueryData(['getRecommendMenus'], (previous: any) => {
          return previous?.map((_item: IMenus) => {
            if (_item.id === item.id) {
              return { ..._item, reopenNotificationRequested: false };
            }
            return _item;
          });
        });
        queryClient.setQueryData(['getMainContents'], (previous: any) => {
          return previous?.map((_item: any) => {
            if (_item.exhibition.id === item.id) {
              return { ..._item, reopenNotificationRequested: false };
            }
            return _item;
          });
        });
        showToast({ message: '알림 신청을 완료했어요!' });
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알림 취소에 실패했습니다.' }));
        console.error(error);
      },
    }
  );

  const { mutate: mutatePostMenuLike } = useMutation(
    async () => {
      const { data } = await postLikeMenus({ menuId: item.id });
      if (data.code === 1032) {
        alert(data.message);
      }
    },
    {
      onSuccess: async () => {
        queryClient.setQueryData(['getMenus', type], (previous: any) => {
          if (previous) {
            return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
          }
        });
        queryClient.setQueryData(['getRecommendMenus'], (previous: any) => {
          return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
        });
        queryClient.setQueryData(['getMainContents'], (previous: any) => {
          return previous?.map((_item: any) => {
            if(_item?.exhibition?.type === 'MD_RECOMMENDED'){
             return onMenuLikes({ previous: _item.exhibition.menus, id: item.id, likeCount: item.likeCount, liked: item.liked });
            }
          }) 
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
        queryClient.setQueryData(['getMenus', type], (previous: any) => {
          if (previous) {
            return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
          }
        });
        queryClient.setQueryData(['getRecommendMenus'], (previous: any) => {
          if (previous) {
            return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
          }
        });
        queryClient.setQueryData(['getMainContents'], (previous: any) => {
          if (previous) {
            return previous?.map((_item: any) => {
              if(_item?.exhibition?.type === 'MD_RECOMMENDED'){
               return onMenuLikes({ previous: _item.exhibition.menus, id: item.id, likeCount: item.likeCount, liked: item.liked });
              }
            })   
          }
        });
        queryClient.invalidateQueries(['getLikeMenus', 'GENERAL']);
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
        console.error(error);
      },
    }
  );

  const { me } = useSelector(userForm);
  const { menuDetails, isReopen } = item;
  const { discount, discountedPrice } = getMenuDisplayPrice(menuDetails ?? [{}]);
  let { isItemSold, checkIsBeforeThanLaunchAt } = checkMenuStatus(item);

  const isTempSold = isItemSold && !isReopen;
  const isOpenSoon = !isItemSold && isReopen && checkIsBeforeThanLaunchAt.length > 0;
  const isReOpen = isItemSold && isReopen;

  const goToCartSheet = (e: any) => {
    e.stopPropagation();
    if (isItemSold || checkIsBeforeThanLaunchAt.length > 0) {
      return;
    }

    dispatch(
      SET_BOTTOM_SHEET({
        content: <CartSheet menuItem={item} />,
      })
    );

    dispatch(SET_MENU_ITEM(item));
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

    if (isTempSold) {
      return <Badge message="일시품절" />;
    } else if (isOpenSoon) {
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
        onSubmit: () => router.push(`/onboarding?returnPath=${encodeURIComponent(String(router.asPath))}`),
        closeBtnText: '취소',
      })
    );
  };

  const goToReopen = (e: any, item: IMenus) => {
    e.stopPropagation();
    if (item.reopenNotificationRequested && me) {
      mutateDeleteNotification();
      return;
    } else {
      if (!me) {
        return dispatch(
          SET_ALERT({
            alertMessage: '로그인이 필요한 기능이에요.\n로그인 하시겠어요?',
            onSubmit: () =>
              router.push(`/onboarding?returnPath=${encodeURIComponent(String(`/menu/${item.id}?isReopen=true`))}`),
            closeBtnText: '취소',
          })
        );
      } else {
        dispatch(SET_MENU_ITEM(item));
        router.push({
          pathname: `/menu/[menuId]`,
          query: { isReopen: true, returnPath: router.asPath, menuId: item.id },
        });
      }
    }
  };

  return (
    <Container onClick={() => goToDetail(item)} isHorizontal={isHorizontal}>
      <ImageWrapper isHorizontal={isHorizontal}>
        <Image
          src={item.thumbnail[0]?.url}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          className="rounded"
        />
        {isReOpen && (
          <ForReopen>
            <TextH6B color={theme.white}>재오픈 알림받기</TextH6B>
          </ForReopen>
        )}
        {isReOpen || isOpenSoon ? (
          <ReopenBtn onClick={(e) => goToReopen(e, item)}>
            <SVGIcon name={item.reopenNotificationRequested ? 'reopened' : 'reopen'} />
          </ReopenBtn>
        ) : (
          <>
            {!isTempSold && (
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
          {isHorizontal ? (
            <TextB2R margin="8px 0 0px 0" width="100%" textHideMultiline>
              {item.name.trim()}
            </TextB2R>
          ) : (
            <TextB2R margin="8px 0 0px 0" width="100%" textHide>
              {item.name.trim()}
            </TextB2R>
          )}
        </NameWrapper>
        {!isOpenSoon && !isReOpen && (
          <PriceWrapper isHorizontal={isHorizontal}>
            {discount > 0 && (
              <TextH5B color={theme.brandColor} padding="0 4px 0 0">
                {discount}%
              </TextH5B>
            )}
            <TextH5B>{discountedPrice.toLocaleString()}원</TextH5B>
          </PriceWrapper>
        )}
        {!isHorizontal && (
          <>
            <DesWrapper>
              <TextB3R color={theme.greyScale65} textHideMultiline>
                {item.summary.trim()}
              </TextB3R>
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
            <Tag margin="0px 8px 8px 0px">{TAG_MAP[item.constitutionTag]}</Tag>
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
  cursor: pointer;
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
  margin-top: 8px;
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

const ImageWrapper = styled.div<{ isHorizontal?: boolean }>`
  position: relative;

  .rounded {
    border-radius: 8px;
  }
  ${({ isHorizontal }) => {
    if (isHorizontal) {
      return css`
        width: 132px;
        height: 132px;
      `;
    } else {
      return css`
        width: 100%;
      `;
    }
  }}
`;

const NameWrapper = styled.div`
  height: 26px;
  width: 100%;
  margin-bottom: 4px;
`;

const PriceWrapper = styled.div<{ isHorizontal?: boolean }>`
  display: flex;
  // margin-top: ${({ isHorizontal }) => isHorizontal && '22px'};
`;

const LikeAndReview = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 0 0px;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
`;

const TagWrapper = styled.div`
  white-space: wrap;
  margin-top: 8px;
`;

export default React.memo(Item);
