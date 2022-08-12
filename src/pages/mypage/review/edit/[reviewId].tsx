import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ReviewInfo, ReviewInfoBottom } from '@components/Pages/Mypage/Review';
import { homePadding, FlexCol, FlexRow, theme, FlexBetween, fixedBottom } from '@styles/theme';
import { TextH3B, TextB2R, TextH6B, TextB3R } from '@components/Shared/Text';
import { Button, ButtonGroup } from '@components/Shared/Button';
import BorderLine from '@components/Shared/BorderLine';
import TextArea from '@components/Shared/TextArea';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getReviewDetailApi, editMenuReviewApi, deleteReviewApi } from '@api/menu';
import { StarRating } from '@components/StarRating';
import { userForm } from '@store/user';
import { useRouter } from 'next/router';
import { IPatchReviewRequest } from '@model/index';
import Image from '@components/Shared/Image';
import { INIT_MENU_IMAGE } from '@store/review';
import { NickName } from '../write/[orderDeliveryId]';
import { getLimitDateOfReview } from '@utils/menu';
import { ReviewImagePreview, ReviewImageUpload } from '@components/Pages/Review';
import { hide, show } from '@store/loading';

interface IProp {
  menuId: string;
  reviewId: string;
  menuImage: string;
}

const LIMIT = 30;

const EditReviewPage = ({ reviewId, menuId, menuImage }: IProp) => {
  const [isShow, setIsShow] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [hoverRating, setHoverRating] = useState<number>(0);
  const [rating, setRating] = useState(5);
  const [numberOfReviewContent, setNumberOfReviewContent] = useState<number>(0);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { me } = useSelector(userForm);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const {
    data: selectedReviewDetail,
    isLoading,
  } = useQuery(
    'getReviewDetail',
    async () => {
      const params = {
        id: Number(menuId),
        menuReviewId: Number(reviewId),
      };

      const { data } = await getReviewDetailApi(params);
      return data.data;
    },

    {
      onError: () => {
        router.back();
      },

      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const { mutateAsync: mutateEditMenuReview } = useMutation(
    async (reqBody: IPatchReviewRequest) => {
      await editMenuReviewApi({ data: reqBody, reviewId: Number(reviewId) });
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getReviewDetail');
        dispatch(
          SET_ALERT({
            alertMessage: `후기 수정이 완료되었습니다.`,
            submitBtnText: '확인',
            onSubmit: () => {
              router.replace('/mypage/review?tab=/completed');
            },
          })
        );
      },
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
    }
  );

  const { mutateAsync: mutateDeleteMenuReview } = useMutation(
    async () => {
      await deleteReviewApi({ id: Number(reviewId) });
    },
    {
      onSuccess: async () => {
        router.back();
        await queryClient.refetchQueries('getCompleteWriteReview');
      },
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
    }
  );

  getLimitDateOfReview(selectedReviewDetail?.menuReview?.createdAt!);

  useEffect(() => {
    return () => {
      dispatch(INIT_MENU_IMAGE());
    };
  });

  useEffect(() => {
    if (textAreaRef.current) {
      setNumberOfReviewContent(textAreaRef.current?.value?.length);
    }
  }, [selectedReviewDetail]);

  const onStarHoverRating = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;

    setHoverRating(idx);

    if (xPos <= 0.5) {
      idx -= 0.5;
    }

    setRating(idx);
  };

  const writeReviewHandler = () => {
    if (textAreaRef.current) {
      const text = textAreaRef.current?.value.trim();
      setNumberOfReviewContent(text.length);
    }
  };

  const onUploadStartHandler = () => {
    setImageUploading(true);
    dispatch(show());
  }

  const onUploadFinishHandler = () => {
    setImageUploading(false);
    dispatch(hide());
  }

  const fileUploadErrorHandler = (alertMessage: string) => {
    dispatch(SET_ALERT({ alertMessage }));
  }

  const uploadSuccessHandler = (url: string) => {
    setReviewImages(imageList => [...imageList, url]);
  }

  const removePreviewImgHandler = (index: number) => {
    const filterImages = reviewImages.filter((img, idx) => idx !== index);
    setReviewImages(filterImages)
  };

  const finishWriteReview = async () => {
    if (over30Letter) {
      dispatch(SET_ALERT({ alertMessage: '최소 30자 이상 입력해 주세요' }));
      return;
    }

    if (imageUploading) {
      dispatch(SET_ALERT({ alertMessage: '사진 등록 완료 후 다시 시도해 주세요. 😭' }));
      return;
    }
    const reqBody = {
      content: textAreaRef?.current?.value!,
      images: reviewImages,
      rating,
    };

    return mutateEditMenuReview(reqBody);
  };

  const deleteReview = () => {
    dispatch(
      SET_ALERT({
        alertMessage: `삭제 후 재작성은 불가합니다. \n작성한 후기를 삭제하시겠어요?`,
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => mutateDeleteMenuReview(),
      })
    );
  };

  useEffect(() => {
    if (selectedReviewDetail) {
      const images = selectedReviewDetail.menuReview?.images || [];
      setReviewImages(images.map((img) => img.url));
      setRating(selectedReviewDetail.menuReview.rating);
    }
  }, [selectedReviewDetail]);

  const over30Letter = LIMIT - numberOfReviewContent > 0;

  if (isLoading) {
    return <div>로딩</div>;
  }
  console.log('selectedReviewDetail', selectedReviewDetail);

  return (
    <Container>
      <Wrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
        <FlexCol padding="16px 0 24px 0">
          <TextH3B>
            <NickName>{me?.nickname}</NickName>님
          </TextH3B>
          {selectedReviewDetail?.menuReview.orderType === 'SUBSCRIPTION' ? (
            <TextH3B>이용 중인 구독은 만족하셨나요?</TextH3B>
          ) : (
            <TextH3B>구매하신 상품은 만족하셨나요?</TextH3B>
          )}
        </FlexCol>
        <FlexRow>
          <ImgWrapper>
            <Image
              src={menuImage}
              alt="상품이미지"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              className="rounded"
            />
          </ImgWrapper>
          <TextWrapper>
            <TextB2R>{selectedReviewDetail?.menuReview.displayMenuName}</TextB2R>
            {selectedReviewDetail?.menuReview.orderType === 'SUBSCRIPTION' && (
              <TextB3R padding="4px 0 0" color={theme.greyScale65}>
                <b>배송</b> {selectedReviewDetail?.menuReview.deliveryRound}회차
              </TextB3R>
            )}
          </TextWrapper>
        </FlexRow>
        <RateWrapper>
          <StarRating rating={rating} hoverRating={hoverRating} onClick={onStarHoverRating} />
          <TextH6B color={theme.greyScale45} padding="8px 0 0 0">
            별점을 선택해 주세요.
          </TextH6B>
        </RateWrapper>
        <TextArea
          name="reviewArea"
          placeholder=" - 맛과 양, 신선도, 패키지, 조리법 등 상품 대해 만족한 점, 아쉬운 점 모두 솔직하게 남겨주세요. &#13;&#10;
          - 띄어쓰기 포함한 최소 30자 이상 작성해 주세요.&#13;&#10;
          - 비방성, 광고글, 문의사항 관련 내용이 포함된 후기는 관리자에 의해 삭제될 수 있어요.&#13;&#10;
          "
          minLength={0}
          maxLength={1000}
          rows={20}
          eventHandler={writeReviewHandler}
          ref={textAreaRef}
          value={selectedReviewDetail?.menuReview?.content}
        />
        <FlexBetween margin="8px 0 0 0">
          <TextB3R color={theme.brandColor}>
            {!over30Letter
              ? '글자 수 조건 충족!'
              : `${LIMIT - numberOfReviewContent}자만 더 쓰면 포인트 적립 조건 충족!`}
          </TextB3R>
          <TextB3R>{numberOfReviewContent.toLocaleString()}/1,000</TextB3R>
        </FlexBetween>
      </Wrapper>
      <BorderLine height={8} margin="32px 0" />
      <UploadPhotoWrapper>
        <FlexRow>
          <TextH3B>사진도 등록해보세요</TextH3B>
          <TextB2R padding="0 0 0 4px">(최대 2장)</TextB2R>
        </FlexRow>
        <FlexRow>
          <TextB3R color={theme.systemRed} margin="6px 0 0 0">
            자사 제품과 무관한 사진 첨부 시 통보 없이 후기 삭제 및 포인트 회수가 진행 될 수 있습니다.
          </TextB3R>
        </FlexRow>
        <FlexRow>
          <ReviewImageUpload
            onError={fileUploadErrorHandler} onSuccess={uploadSuccessHandler}
            onStart={onUploadStartHandler} onFinish={onUploadFinishHandler} disabled={reviewImages.length > 1}/>
          {reviewImages.map((img: string, index: number) => {
              return (
                <ReviewImagePreview key={index} image={img} onRemove={()=> removePreviewImgHandler(index)}/>
              );
            })}
        </FlexRow>
      </UploadPhotoWrapper>
      <PointInfoWrapper>
        <ReviewInfoBottom />
      </PointInfoWrapper>
      {selectedReviewDetail?.menuReview.editable ? (
        <ButtonGroup
          leftButtonHandler={deleteReview}
          rightButtonHandler={finishWriteReview}
          leftText="삭제하기"
          rightText="수정하기"
        />
      ) : (
        <ButtonWrapper>
          <Button height="100%" width="100%" borderRadius="0" onClick={deleteReview}>
            삭제하기
          </Button>
        </ButtonWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding-top: 8px;
`;
const Wrapper = styled.div`
  ${homePadding}
`;
const ImgWrapper = styled.div`
  width: 70px;
  .rounded {
    border-radius: 8px;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  width: 100%;
  padding-left: 16px;
`;

const RateWrapper = styled.div`
  padding: 24px 0 24px 0;
  > div {
    display: flex;
  }
`;

const UploadPhotoWrapper = styled.div`
  position: relative;
  ${homePadding}
`;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

const PointInfoWrapper = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  margin-bottom: 56px;
`;

export async function getServerSideProps(context: any) {
  const { reviewId, menuId, menuImage } = context.query;
  return {
    props: { reviewId, menuId, menuImage },
  };
}

export default EditReviewPage;
