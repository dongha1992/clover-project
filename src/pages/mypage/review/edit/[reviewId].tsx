import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ReviewInfo, ReviewInfoBottom } from '@components/Pages/Mypage/Review';
import { homePadding, FlexCol, FlexRow, theme, FlexBetween, fixedBottom } from '@styles/theme';
import { TextH3B, TextB2R, TextH6B, TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { SVGIcon, getImageSize } from '@utils/common';
import { Button, ButtonGroup } from '@components/Shared/Button';
import BorderLine from '@components/Shared/BorderLine';
import TextArea from '@components/Shared/TextArea';
import TextInput from '@components/Shared/TextInput';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getReviewDetailApi, editMenuReviewApi, deleteReviewApi } from '@api/menu';
import { StarRating } from '@components/StarRating';
import { userForm } from '@store/user';
import { useRouter } from 'next/router';
import { IPatchReviewRequest } from '@model/index';
import { postImageApi } from '@api/image';
import NextImage from 'next/image';
import { reviewSelector, INIT_MENU_IMAGE } from '@store/review';
import { NickName } from '../write/[orderDeliveryId]';
import { getLimitDateOfReview } from '@utils/menu';

interface IWriteMenuReviewObj {
  imgFiles: string[] | undefined;
  deletedImgIds: string[];
  preview: string[];
}

interface IProp {
  menuId: string;
  reviewId: string;
  menuImage: string;
}

const LIMIT = 30;

const EditReviewPage = ({ reviewId, menuId, menuImage }: IProp) => {
  const [isShow, setIsShow] = useState(false);
  const [writeMenuReviewObj, setWriteMenuReviewObj] = useState<IWriteMenuReviewObj>({
    imgFiles: [],
    deletedImgIds: [],
    preview: [],
  });

  const [hoverRating, setHoverRating] = useState<number>(0);
  const [rating, setRating] = useState(5);
  const [numberOfReivewContent, setNumberOfReivewContent] = useState<number>(0);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { me } = useSelector(userForm);
  const { menu } = useSelector(reviewSelector);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  /* TODO: blob 타입 정의 */
  /* TODO: 사이즈 체크 및 사진 올리는 hooks */

  const {
    data: selectedReviewDetail,
    error: menuError,
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
      onSuccess: async (data) => {},
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
      const { data } = await editMenuReviewApi({ data: reqBody, reviewId: Number(reviewId) });
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
      const { data } = await deleteReviewApi({ id: Number(reviewId) });
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

  const { limitAt, deliveryAt, isAvailable } = getLimitDateOfReview(selectedReviewDetail?.menuReview?.createdAt!);

  useEffect(() => {
    return () => {
      dispatch(INIT_MENU_IMAGE());
    };
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      setNumberOfReivewContent(textAreaRef.current?.value?.length);
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
      setNumberOfReivewContent(text.length);
    }
  };

  const onChangeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const LIMIT_SIZE = 5 * 1024 * 1024;
    const LIMIT_SIZE = 1000000;

    let imageFile = e.target.files! as any;
    if (!imageFile[0]) return;

    try {
      if (imageFile.length! > 0) {
        /* 사이즈 제한 걸리는 경우 */
        if (LIMIT_SIZE < imageFile[0].size) {
          /* 이미지 사이즈 줄이기 */
          const blobURL = window.URL.createObjectURL(imageFile[0]);
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          const MIME_TYPE = 'image/jpeg';
          const QUALITY = 0.8;
          const img = new Image();
          img.src = blobURL;

          img.onerror = () => {
            URL.revokeObjectURL(blobURL);
            alert('이미지 업로드에 실패했습니다');
            return;
          };
          img.onload = () => {
            URL.revokeObjectURL(blobURL);
            const [formatWidth, formatHeight] = getImageSize(img, MAX_WIDTH, MAX_HEIGHT);
            const canvas = document.createElement('canvas');
            canvas.width = formatWidth;
            canvas.height = formatHeight;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(img, 0, 0, formatWidth, formatHeight);
            canvas.toBlob(
              (blob: any) => {
                imageFile = new File([blob], imageFile[0].name, {
                  type: imageFile[0].type,
                });
                getImageFileReader(imageFile);
              },
              MIME_TYPE,
              QUALITY
            );
          };
        } else {
          getImageFileReader(imageFile[0]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getImageFileReader = (imageFile: any) => {
    const imageFileReader = new FileReader();
    imageFileReader.onload = (e: any) => {
      setWriteMenuReviewObj({
        ...writeMenuReviewObj,
        preview: [...writeMenuReviewObj?.preview!, e.target.result],
        imgFiles: [...writeMenuReviewObj?.imgFiles!, imageFile],
      });
    };
    imageFileReader.readAsDataURL(imageFile);
  };

  const removePreviewImgHandler = (index: number) => {
    const filterImg = writeMenuReviewObj?.imgFiles?.filter((img, idx) => idx !== index);
    const filterPreviewImg = writeMenuReviewObj?.preview?.filter((img, idx) => idx !== index);
    setWriteMenuReviewObj({ ...writeMenuReviewObj, imgFiles: filterImg, preview: filterPreviewImg });
  };

  const finishWriteReview = async () => {
    if (over30Letter) {
      dispatch(SET_ALERT({ alertMessage: '최소 30자 이상 입력해 주세요' }));
      return;
    }

    let formData = new FormData();
    let location = [];

    if (writeMenuReviewObj?.imgFiles?.length! > 0) {
      for (let i = 0; i < writeMenuReviewObj?.imgFiles?.length!; i++) {
        try {
          const img = writeMenuReviewObj.imgFiles && writeMenuReviewObj?.imgFiles[i]!;

          if (typeof img === 'string') {
            location.push(img);
          } else {
            console.log('here');
            formData.append('media', img!);
            const result = await postImageApi(formData);
            formData = new FormData();
            location.push(result.headers.location);
          }
        } catch (error) {
          console.error(error);
          dispatch(SET_ALERT({ alertMessage: '이미지 업로드에 실패했습니다.' }));
          return;
        }
      }
    }

    const hasReviewImgs = location.length !== 0;

    const reqBody = {
      content: textAreaRef?.current?.value!,
      images: hasReviewImgs ? location : [],
      rating,
    };

    mutateEditMenuReview(reqBody);
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
      setWriteMenuReviewObj({
        ...writeMenuReviewObj,
        imgFiles: selectedReviewDetail?.menuReview?.images?.map((img) => img.url)!,
        preview: selectedReviewDetail?.menuReview?.images?.map((img) => img.url)!,
      });
      setRating(selectedReviewDetail.menuReview.rating);
    }
  }, [selectedReviewDetail]);

  const over30Letter = LIMIT - numberOfReivewContent > 0;

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
            <NextImage
              src={IMAGE_S3_URL + menuImage}
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
              : `${LIMIT - numberOfReivewContent}자만 더 쓰면 포인트 적립 조건 충족!`}
          </TextB3R>
          <TextB3R>{numberOfReivewContent.toLocaleString()}/1,000</TextB3R>
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
          {writeMenuReviewObj?.imgFiles?.length! < 2 && (
            <UploadInputWrapper>
              <TextInput
                width="100%"
                height="100%"
                padding="0"
                inputType="file"
                accept="image/*"
                eventHandler={onChangeFileHandler}
              />
              <div className="plusBtn">
                <SVGIcon name="plus18" />
              </div>
            </UploadInputWrapper>
          )}
          {writeMenuReviewObj?.preview?.length! > 0 &&
            writeMenuReviewObj?.preview?.map((img: string, index: number) => {
              const base64 = img?.includes('data:image');
              return (
                <PreviewImgWrapper key={index}>
                  <img src={base64 ? img : `${process.env.REVIEW_IMAGE_URL}${img}`} />
                  <div className="svgWrapper" onClick={() => removePreviewImgHandler(index)}>
                    <SVGIcon name="blackBackgroundCancel" />
                  </div>
                </PreviewImgWrapper>
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

const UploadInputWrapper = styled.label`
  position: relative;
  display: block;
  width: 72px;
  height: 72px;
  background-color: ${theme.greyScale6};
  border-radius: 8px;
  margin: 16px 0 48px 0;
  cursor: pointer;
  input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }

  .plusBtn {
    position: absolute;
    left: 40%;
    top: 35%;
  }
`;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

const PreviewImgWrapper = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  background-color: ${theme.greyScale6};
  border-radius: 8px;
  margin: 16px 0 48px 8px;
  border: none;

  > img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }

  .svgWrapper {
    svg {
      cursor: pointer;
      position: absolute;
      right: 10%;
      top: 10%;
    }
  }
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
