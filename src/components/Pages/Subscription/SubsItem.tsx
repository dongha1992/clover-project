import { deleteLikeMenus, postLikeMenus } from '@api/menu';
import Badge from '@components/Item/Badge';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { onMenuLikes } from '@queries/menu';
import { SET_ALERT } from '@store/alert';
import { filterSelector } from '@store/filter';
import { userForm } from '@store/user';
import { FlexWrapWrapper, theme } from '@styles/theme';
import { getFormatPrice, SVGIcon } from '@utils/common';
import { getMenuDisplayPrice } from '@utils/menu';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Label } from './SubsCardItem';

interface IProps {
  item: any;
  height?: string;
  width?: string;
  testType?: string;
}
const SubsItem = ({ item, height, width, testType }: IProps) => {
  const [tagList, setTagList] = useState<string[]>([]);
  const { me } = useSelector(userForm);
  const { type } = useSelector(filterSelector);
  const {
    id,
    menuDetails,
    badgeMessage,
    name,
    description,
    liked,
    likeCount,
    summary,
    subscriptionPeriods,
    subscriptionDeliveries,
    isSold,
  } = item;
  const { discountedPrice } = getMenuDisplayPrice(menuDetails ?? [{}]);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO(young): 단기구독전용, 쿠폰 등이 태그로 들어가는데 현재 쿠폰태그가 추가될지 모르는 상황 추후 배열로 처리할지 string으로 처리할지 수정필요

    if (!subscriptionPeriods?.includes('UNLIMITED') && !tagList?.includes('단기구독전용')) {
      setTagList([...tagList, '단기구독전용']);
    }

    if (isSold) {
      setTagList([...tagList, '일시품절']);
    }
  }, []);

  const { mutate: mutateDeleteMenuLike } = useMutation(
    async () => {
      const { data } = await deleteLikeMenus({ menuId: item.id });
    },
    {
      onSuccess: async () => {
        queryClient.setQueryData(['getSubscriptionMenus'], (previous: any) => {
          if (previous) {
            return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
          }
        });
        queryClient.invalidateQueries(['getLikeMenus', 'SUBSCRIPTION']);
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
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
        queryClient.setQueryData(['getSubscriptionMenus'], (previous: any) => {
          if (previous) {
            return onMenuLikes({ previous, id: item.id, likeCount: item.likeCount, liked: item.liked });
          }
        });
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
        console.error(error);
      },
    }
  );

  const goToDetail = () => {
    router.push(`/menu/${id}`);
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

  return (
    <ItemBox width={width}>
      <ImageWrapper height={height} onClick={goToDetail}>
        <Image
          src={IMAGE_S3_URL + item.thumbnail[0].url}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
        />

        <LabelArea>
          {badgeMessage && <Badge message={badgeMessage} />}

          <TagBox className={`${badgeMessage ? 'marginL8' : 'marginL16'}`}>
            {subscriptionDeliveries?.map((item: string, index: number) => (
              <Label className={item} key={index}>
                {DELIVERY_TYPE_MAP[item]}
              </Label>
            ))}
            {tagList && tagList?.map((tag: string, index: number) => <Tag key={index}>{tag}</Tag>)}
          </TagBox>
        </LabelArea>
      </ImageWrapper>
      <TextBox>
        <TextH5B>{name?.trim()}</TextH5B>
        <TextB3R color={theme.greyScale65} margin="8px 0 4px" className="description" textHide>
          {summary?.trim()}
        </TextB3R>
        <FlexWrapWrapper>
          <TextH5B>{getFormatPrice(String(discountedPrice))}원 ~</TextH5B>
          <Like onClick={menuLikeHandler}>
            <SVGIcon name={`${liked ? 'likeRed18' : 'likeBorderGray'}`} />
            <TextB3R padding="3px 0 0 2px">{likeCount}</TextB3R>
          </Like>
        </FlexWrapWrapper>
      </TextBox>
    </ItemBox>
  );
};
const ItemBox = styled.div<{ width: string | undefined }>`
  width: ${(props) => (props.width ? props.width : '100%')};
  margin-bottom: 24px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ImageWrapper = styled.div<{ height: string | undefined }>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.height ? props.height : '176px')};
  max-height: 261px;
  border-radius: 8px;
  overflow: hidden;
`;

const LabelArea = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 16px;
  > div {
    position: relative;
  }
  span {
    margin-right: 4px;
  }
`;

const TagBox = styled.div`
  display: flex;
  &.marginL8 {
    margin-left: 8px;
  }
  &.marginL16 {
    margin-left: 16px;
  }
`;

const Tag = styled.span`
  z-index: 1;
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  background: rgba(36, 36, 36, 0.8);
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  line-height: 16px;
  color: #fff;
`;
const TextBox = styled.div`
  padding-top: 8px;
  .description {
    height: 18px;
    line-height: 18px;
    overflow: hidden;
  }
`;
const Like = styled.div`
  display: flex;
  align-items: center;
`;
export default SubsItem;
