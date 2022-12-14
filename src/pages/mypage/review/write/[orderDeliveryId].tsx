import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { ReviewInfo, ReviewInfoBottom } from '@components/Pages/Mypage/Review';
import { homePadding, FlexCol, FlexRow, theme, FlexBetween, fixedBottom } from '@styles/theme';
import { TextH3B, TextB2R, TextH6B, TextB3R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import BorderLine from '@components/Shared/BorderLine';
import TextArea from '@components/Shared/TextArea';
import { Button } from '@components/Shared/Button';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from '@components/Shared/Tooltip';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getMenuDetailApi, createMenuReviewApi } from '@api/menu';
import Image from '@components/Shared/Image';
import { StarRating } from '@components/StarRating';
import { userForm } from '@store/user';
import { ICreateReivewRequest } from '@model/index';
import router from 'next/router';
import { ReviewImagePreview, ReviewImageUpload } from '@components/Pages/Review';
import { show, hide } from '@store/loading';

const LIMIT = 30;

export const FinishReview = () => {
  return (
    <FinishComplete>
      <div className="svg">
        <SVGIcon name="reviewComplete" />
      </div>
      <div className="point">
        <TextH3B color={theme.white}>300P</TextH3B>
      </div>
    </FinishComplete>
  );
};

interface IProps {
  menuId: number;
  orderDeliveryId: number;
  menuDetailId: number;
  orderType: string;
  deliveryRound: string;
}

const WriteReviewPage = ({ menuId, orderDeliveryId, menuDetailId, orderType, deliveryRound }: IProps) => {
  const [isShow, setIsShow] = useState(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [numberOfReivewContent, setNumberOfReivewContent] = useState<number>(0);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [rating, setRating] = useState(5);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { me } = useSelector(userForm);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading } = useQuery(
    'getMenuDetail',
    async () => {
      dispatch(show());
      const { data } = await getMenuDetailApi(menuId);
      return data.data;
    },

    {
      onError: () => {
        dispatch(
          SET_ALERT({
            alertMessage: '??? ??? ?????? ????????? ??????????????????.',
            onSubmit() {
              return router.back();
            },
          })
        );
      },
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const { mutateAsync: mutateCreateMenuReview } = useMutation(
    async (reqBody: ICreateReivewRequest) => {
      await createMenuReviewApi(reqBody);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getReviewDetail');
        await queryClient.refetchQueries('getWillWriteReview');
        await queryClient.refetchQueries('getCompleteWriteReview');
        dispatch(
          SET_ALERT({
            children: <FinishReview />,
            alertMessage: `????????? ????????? \n ????????? ????????? ?????????!`,
            onSubmit: () => router.replace('/mypage/review/completed'),
            submitBtnText: '??????',
          })
        );
      },
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
    }
  );

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
      setNumberOfReivewContent(text.length);
    }
  };

  const onUploadStartHandler = () => {
    setImageUploading(true);
  };

  const onUploadFinishHandler = () => {
    setImageUploading(false);
  };

  const fileUploadErrorHandler = (alertMessage: string) => {
    dispatch(SET_ALERT({ alertMessage }));
  };

  const uploadSuccessHandler = (url: string) => {
    setReviewImages(imageList => [...imageList, url]);
  };

  const removePreviewImgHandler = (index: number) => {
    const filterImages = reviewImages.filter((img, idx) => idx !== index);
    setReviewImages(filterImages);
  };

  const finishWriteReview = async () => {
    if (over30Letter) {
      dispatch(SET_ALERT({ alertMessage: '?????? 30??? ?????? ????????? ?????????' }));
      return;
    }
    if (imageUploading) {
      dispatch(SET_ALERT({ alertMessage: '?????? ?????? ?????? ??? ?????? ????????? ?????????. ????' }));
      return;
    }

    const reqBody = {
      content: textAreaRef?.current?.value!,
      images: reviewImages,
      menuDetailId: Number(menuDetailId),
      menuId: Number(menuId),
      orderDeliveryId: Number(orderDeliveryId),
      orderType: orderType,
      rating,
    };

    return mutateCreateMenuReview(reqBody);
  };

  const over30Letter = LIMIT - numberOfReivewContent > 0;

  return (
    <Container>
      <Wrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
        <FlexCol padding="16px 0 24px 0">
          <TextH3B>
            <NickName>{me?.nickname}</NickName>???
          </TextH3B>
          {orderType === 'SUBSCRIPTION' ? (
            <TextH3B>?????? ?????? ????????? ???????????????????</TextH3B>
          ) : (
            <TextH3B>???????????? ????????? ???????????????????</TextH3B>
          )}
        </FlexCol>
        <FlexRow>
          <ImgWrapper>
            <Image
              src={data?.thumbnail[0].url || ''}
              alt="???????????????"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              className="rounded"
            />
          </ImgWrapper>
          <TextWrapper>
            <TextB2R>{data?.name}</TextB2R>
            {orderType === 'SUBSCRIPTION' && (
              <TextB3R padding="4px 0 0" color={theme.greyScale65}>
                <b>??????</b> {deliveryRound}??????
              </TextB3R>
            )}
          </TextWrapper>
        </FlexRow>
        <RateWrapper>
          <StarRating rating={rating} hoverRating={hoverRating} onClick={onStarHoverRating} />
          <TextH6B color={theme.greyScale45} padding="8px 0 0 0">
            ????????? ????????? ?????????.
          </TextH6B>
        </RateWrapper>
        <TextArea
          name="reviewArea"
          placeholder=" - ?????? ???, ?????????, ?????????, ????????? ??? ?????? ?????? ????????? ???, ????????? ??? ?????? ???????????? ???????????????.                                                                                                - ???????????? ????????? ?????? 30??? ?????? ????????? ?????????.                                            - ?????????, ?????????, ???????????? ?????? ????????? ????????? ????????? ???????????? ?????? ????????? ??? ?????????."
          minLength={0}
          maxLength={1000}
          rows={20}
          eventHandler={writeReviewHandler}
          ref={textAreaRef}
        />
        <FlexBetween margin="8px 0 0 0">
          <TextB3R color={theme.brandColor}>
            {!over30Letter
              ? '?????? ??? ?????? ??????!'
              : `${LIMIT - numberOfReivewContent}?????? ??? ?????? ????????? ?????? ?????? ??????!`}
          </TextB3R>
          <TextB3R>{numberOfReivewContent.toLocaleString()}/1,000</TextB3R>
        </FlexBetween>
      </Wrapper>
      <BorderLine height={8} margin="32px 0" />
      <UploadPhotoWrapper>
        <Tooltip message={'????????? ?????? ?????? ??? 300P ??????!'} top="-45px" width="200px" left="20px" isBottom />
        <FlexRow>
          <TextH3B>????????? ??????????????????</TextH3B>
          <TextB2R padding="0 0 0 4px">(?????? 2???)</TextB2R>
        </FlexRow>
        <FlexRow>
          <TextB3R color={theme.systemRed} margin="6px 0 0 0">
            1??? ??? 20MB ?????? (jpg, png), ???????????? 255??? ????????? ?????? ????????? ????????? ????????? ?????????.
          </TextB3R>
        </FlexRow>
        <FlexRow>
          <ReviewImageUpload
            onError={fileUploadErrorHandler}
            onSuccess={uploadSuccessHandler}
            onStart={onUploadStartHandler}
            onFinish={onUploadFinishHandler}
            disabled={reviewImages.length > 1}
          />
          {reviewImages.map((img: string, index: number) => {
            return <ReviewImagePreview key={index} image={img} onRemove={() => removePreviewImgHandler(index)} />;
          })}
        </FlexRow>
      </UploadPhotoWrapper>
      <PointInfoWrapper>
        <ReviewInfoBottom />
      </PointInfoWrapper>
      <BtnWrapper onClick={finishWriteReview}>
        <Button height="100%" borderRadius="0">
          ????????????
        </Button>
      </BtnWrapper>
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

const PointInfoWrapper = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  margin-bottom: 56px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;

const FinishComplete = styled.div`
  position: relative;
  .point {
    position: absolute;
    top: 30%;
    left: 40%;
  }
  .svg {
    width: 100%;
  }
`;

export const NickName = styled.span`
  color: ${theme.brandColor};
`;

export async function getServerSideProps(context: any) {
  const { menuId, orderDeliveryId, menuDetailId, orderType, deliveryRound } = context.query;
  return {
    props: { menuId, orderDeliveryId, menuDetailId, orderType, deliveryRound },
  };
}

export default WriteReviewPage;
