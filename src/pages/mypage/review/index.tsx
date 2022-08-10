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
import { SET_IMAGE_VIEWER } from '@store/common';
import useScrollCheck from '@hooks/useScrollCheck';
import { SET_MENU_IMAGE } from '@store/review';
import { useRouter } from 'next/router';
import { SET_ALERT } from '@store/alert';

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

  // const { isScroll } = useSelector(commonSelector);
  const isScroll = useScrollCheck();

  const {
    data: willWriteList,
    error: willWriteError,
    isLoading: willWriteIsLoading,
  } = useQuery<IWillWriteReview[]>(
    'getWillWriteReview',
    async () => {
      const { data } = await getWillWriteReviews();
      return data.data;
    },

    {
      onSuccess: (data) => {},
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
      const { data } = await getCompleteReviews();
      return data.data;
    },

    {
      onSuccess: (data) => {},
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
    if (router.query.tab) {
      setSelectedTab((router.query.tab as string) ? (router.query.tab as string) : 'willWrite');
    }
  }, []);

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

  const clickImgViewHandler = (images: string[], index: number) => {
    const payload = { images, index };
    dispatch(SET_IMAGE_VIEWER(payload));
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

  if (completeIsLoading || willWriteIsLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container ref={ref}>
      <FixedTab scroll={isScroll}>
        <TabList tabList={TAB_LIST} onClick={selectTabHandler} selectedTab={selectedTab} countObj={countObj} />
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
                  clickImgViewHandler={clickImgViewHandler}
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
`;

const FixedTab = styled.div<{ scroll: boolean }>`
  ${fixedTab};

  ${({ scroll }) => {
    if (scroll) {
      return css`
        box-shadow: -1px 9px 16px -4px rgb(0 0 0 / 25%);
      `;
    }
  }}
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
  text-align: center;
`;

const WillReviewItmesWrapper = styled.div``;
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export default ReviewPage;
