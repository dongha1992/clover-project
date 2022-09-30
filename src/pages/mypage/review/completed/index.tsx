import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { fixedTab, homePadding, textBody3, theme } from '@styles/theme';
import { TextB2R } from '@components/Shared/Text';
import { ReviewInfo, CompleteReviewItem } from '@components/Pages/Mypage/Review';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getCompleteReviews, deleteReviewApi } from '@api/menu';
import { ICompletionReviews } from '@model/index';
import { useDispatch } from 'react-redux';
import { SET_MENU_IMAGE } from '@store/review';
import { useRouter } from 'next/router';
import { SET_ALERT } from '@store/alert';
import { hide, show } from '@store/loading';

// 후기 작성 - 작성 완료
const ReviewCompltedPage = () => {
  const [isShow, setIsShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: completeWriteList, error: completeWriteError, isLoading: completeIsLoading } = useQuery<
    ICompletionReviews[]
  >(
    'getCompleteWriteReview',
    async () => {
      dispatch(show());
      const { data } = await getCompleteReviews();
      return data.data;
    },
    {
      onSuccess: data => {},
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: mutateDeleteMenuReview } = useMutation(
    async (id: number) => {
      const { data } = await deleteReviewApi({ id });
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getCompleteWriteReview');
      },
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
    }
  );
  const goToReviewDetail = useCallback(
    ({ url, id, menuId, name }: { url: string; id: number; menuId: number; name: string }) => {
      dispatch(SET_MENU_IMAGE({ url, name }));
      router.push(`/mypage/review/completed/edit/${id}?menuId=${menuId}&menuImage=${encodeURIComponent(url)}`);
    },
    []
  );

  const deleteReviewHandler = (id: number) => {
    dispatch(
      SET_ALERT({
        alertMessage: `삭제 후 재작성은 불가합니다. \n작성한 후기를 삭제하시겠어요?`,
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => mutateDeleteMenuReview(id),
      })
    );
  };

  return (
    <Container ref={ref}>
      <InfoWrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
      </InfoWrapper>
      {!completeWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없어요 😭</TextB2R>
        </Center>
      )}
      <Wrapper>
        <WillReviewItmesWrapper>
          {completeWriteList?.map((review, index) => {
            return (
              <CompleteReviewItem
                key={index}
                review={review}
                goToReviewDetail={goToReviewDetail}
                deleteReviewHandler={deleteReviewHandler}
              />
            );
          })}
        </WillReviewItmesWrapper>
      </Wrapper>
      {completeWriteList?.length! !== 0 && (
        <ReviewInfoWrapper>
          최근 1년 이내 후기 작성 내역만 조회 가능해요. (이전 후기 작성 내역은 고객센터로 문의해 주세요.)
        </ReviewInfoWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  /* padding-bottom: 24px; */
`;

const InfoWrapper = styled.div`
  ${homePadding}
  padding-top:74px;
  margin: 0 24px;
  position: relative;
`;

const Wrapper = styled.div`
  ${homePadding}
  margin-bottom:70px;
`;

const ReviewInfoWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  background-color: ${theme.greyScale3};
  padding: 24px;
  color: ${theme.greyScale65};
  ${textBody3};
`;

const WillReviewItmesWrapper = styled.div`
  margin-top: 50px;
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export default ReviewCompltedPage;
