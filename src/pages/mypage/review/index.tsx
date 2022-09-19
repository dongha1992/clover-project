import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { css } from 'styled-components';
import { fixedTab, homePadding, textBody3, theme } from '@styles/theme';
import { TabList } from '@components/Shared/TabList';
import { TextB2R } from '@components/Shared/Text';
import { WillWriteReviewItem, ReviewInfo, CompleteReviewItem } from '@components/Pages/Mypage/Review';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getCompleteReviews, getWillWriteReviews, deleteReviewApi } from '@api/menu';
import { ICompletionReviews, IWillWriteReview } from '@model/index';
import { useDispatch } from 'react-redux';
import useScrollCheck from '@hooks/useScrollCheck';
import { SET_MENU_IMAGE } from '@store/review';
import { useRouter } from 'next/router';
import { SET_ALERT } from '@store/alert';
import { Obj } from '@model/index';
import { hide, show } from '@store/loading';

const TAB_LIST = [
  { id: 1, text: '작성 예정', value: 'willWrite', link: '/willWrite' },
  { id: 2, text: '작성 완료', value: 'completed', link: '/completed' },
];

const ReviewPage = () => {
  const [selectedTab, setSelectedTab] = useState('/willWrite');
  const [isShow, setIsShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const router = useRouter();
  const queryClient = useQueryClient();

  const isScroll = useScrollCheck();

  const {
    data: willWriteList,
    error: willWriteError,
    isLoading: willWriteIsLoading,
  } = useQuery<IWillWriteReview[]>(
    'getWillWriteReview',
    async () => {
      dispatch(show());
      const { data } = await getWillWriteReviews();
      return data.data;
    },
    {
      onSuccess: (data) => {},
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: completeWriteList,
    error: completeWriteError,
    isLoading: completeIsLoading,
  } = useQuery<ICompletionReviews[]>(
    'getCompleteWriteReview',
    async () => {
      dispatch(show());
      const { data } = await getCompleteReviews();
      return data.data;
    },
    {
      onSuccess: (data) => {},
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

  useEffect(() => {
    const offsetTop = ref?.current?.offsetTop! - 70;
    window.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: offsetTop,
    });
  }, [selectedTab]);

  useEffect(() => {
    if (router.isReady) {
      const TAP_MAP: Obj = {
        review: '/willWrite',
        '/willWrite': '/willWrite',
        '/completed': '/completed',
      };

      setSelectedTab(TAP_MAP[router.query.tab as string] ?? '/willWrite');
    }
  }, [router.isReady]);

  const goToReviewDetail = useCallback(
    ({ url, id, menuId, name }: { url: string; id: number; menuId: number; name: string }) => {
      dispatch(SET_MENU_IMAGE({ url, name }));
      router.push(`/mypage/review/edit/${id}?menuId=${menuId}&menuImage=${encodeURIComponent(url)}`);
    },
    []
  );

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

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

  const countObj = {
    '작성 예정': willWriteList?.length,
    '작성 완료': completeWriteList?.length,
  };

  const isWillWrite = selectedTab === '/willWrite';
  const isComplete = selectedTab === '/completed';

  return (
    <Container ref={ref}>
      <FixedTab>
        <TabList shadowValue={'-20px'} tabList={TAB_LIST} onClick={selectTabHandler} selectedTab={selectedTab} countObj={countObj} />
      </FixedTab>
      <InfoWrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
      </InfoWrapper>
      {isWillWrite && !willWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없어요 😭</TextB2R>
        </Center>
      )}
      {isComplete && !completeWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없어요 😭</TextB2R>
        </Center>
      )}
      {isWillWrite ? (
        <Wrapper>
          <WillReviewItmesWrapper>
            {willWriteList?.map((review, index) => (
              <WillWriteReviewItem key={index} review={review} />
            ))}
          </WillReviewItmesWrapper>
        </Wrapper>
      ) : (
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
      )}
      {((isComplete && completeWriteList?.length! !== 0) || (isWillWrite && willWriteList?.length! !== 0)) && (
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

const FixedTab = styled.div`
  ${fixedTab};
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

export default ReviewPage;
