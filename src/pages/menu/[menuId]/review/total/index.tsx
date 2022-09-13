import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { homePadding, theme } from '@styles/theme';
import { ReviewOnlyImage } from '@components/Pages/Review';
import BorderLine from '@components/Shared/BorderLine';
import { ReviewDetailItem } from '@components/Pages/Review';
import router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { ISearchReviews } from '@model/index';
import { getMenuDetailReviewImageApi, getMenuDetailApi } from '@api/menu';
import { SET_MENU_ITEM, INIT_MENU_ITEM } from '@store/menu';
import { userForm } from '@store/user';
import { useInfiniteMenuReviews } from '@queries/menu';
import { SET_ALERT } from '@store/alert';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import { show, hide } from '@store/loading';
/* TODO: 중복 코드 많음 , 리팩토링 */

const DEFAULT_SIZE = 10;

interface IProps {
  menuId: string;
}

const TotalReviewPage = ({ menuId }: IProps) => {
  const childRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { me } = useSelector(userForm);

  const {
    data: menuDetail,
    error: menuError,
    isLoading: menuDeitalLoading,
  } = useQuery(
    'getMenuDetail',
    async () => {
      dispatch(show());
      const { data } = await getMenuDetailApi(Number(menuId)!);
      return data?.data;
    },
    {
      onSuccess: (data) => {
        dispatch(SET_MENU_ITEM(data));
      },
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, isLoading } =
    useInfiniteMenuReviews({
      id: Number(menuId)!,
      size: DEFAULT_SIZE,
      page: 1,
    });

  const { data: reviewsImages, error: reviewsImagesError } = useQuery(
    'getMenuDetailReviewImages',
    async () => {
      dispatch(show());
      const params = { id: Number(menuId)!, page: 1, size: 10 };
      const { data } = await getMenuDetailReviewImageApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  const { page } = useIntersectionObserver({
    fetchNextPage,
    totalPage: data?.pages[0]?.totalPage!,
    currentPage: data?.pages.length!,
    childRef,
    parentRef,
    isFetching,
  });

  useEffect(() => {
    return () => {
      dispatch(INIT_MENU_ITEM());
    };
  }, []);

  const goToReviewImages = useCallback(() => {
    router.push(`/menu/${menuId}/review/photo`);
  }, []);

  const goToReviewDetail = (id: number) => {
    router.push(`/menu/${menuId}/review/${id}`);
  };

  const hasImageReview = reviewsImages?.images?.length! !== 0;

  if (isFetching) {
    dispatch(show());
  } else {
    dispatch(hide());
  }

  return (
    <Container ref={parentRef}>
      <Wrapper>
        <ImageWrapper hasImageReview={hasImageReview}>
          {hasImageReview && (
            <ReviewOnlyImage
              reviewsImages={reviewsImages?.images!}
              goToReviewImages={goToReviewImages}
              goToReviewDetail={goToReviewDetail}
              averageRating={menuDetail?.rating!}
              totalReviews={menuDetail?.reviewCount!}
              totalImgs={reviewsImages?.pagination.total!}
            />
          )}
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            borderRadius="8"
            margin="0 0 32px 0"
            onClick={() => {
              if (!me) {
                return dispatch(
                  SET_ALERT({
                    alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
                    submitBtnText: '확인',
                    closeBtnText: '취소',
                    onSubmit: () => router.push(`/onboarding?returnPath=${encodeURIComponent(location.pathname)}`),
                  })
                );
              }
              router.push('/mypage/review');
            }}
          >
            {me ? '후기 작성하기 (최대 300P 적립)' : '로그인 후 후기 작성하기'}
          </Button>
        </ImageWrapper>
        <BorderLine height={8} />
        {data?.pages[0]?.result?.length !== 0 ? (
          data?.pages?.map((page: any, index: number) => {
            return (
              <List key={index}>
                {page.result?.map((review: ISearchReviews, index: number) => {
                  return (
                    <div key={index}>
                      <ReviewDetailItem review={review} />
                      <BorderLine margin="24px 0 24px 0" height={1} />
                    </div>
                  );
                })}
              </List>
            );
          })
        ) : (
          <EmptyWrapper>
            <TextB2R color={theme.greyScale65} padding="0 0 16px 0">
              상품의 첫 번째 후기를 작성해주세요 :)
            </TextB2R>
          </EmptyWrapper>
        )}
      </Wrapper>
      <div className="last" ref={childRef}></div>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  width: 100%;

  ${homePadding}
  .last {
    height: 20px;
  }
`;

const EmptyWrapper = styled.div`
  display: flex;
  height: 50vh;
  align-items: center;
  justify-content: center;
`;

const ImageWrapper = styled.div<{ hasImageReview?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 16px;

  ${({ hasImageReview }) => {
    if (!hasImageReview) {
      return css`
        justify-content: center;
        align-items: center;
        /* height: 50vh; */
      `;
    }
  }}
`;

const List = styled.div`
  padding-top: 32px;
  width: 100%;
`;

export async function getServerSideProps(context: any) {
  const { menuId } = context.query;

  return {
    props: { menuId },
  };
}

export default TotalReviewPage;
