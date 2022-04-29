import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ReviewInfo } from '@components/Pages/Mypage/Review';
import { homePadding, FlexCol, FlexRow, theme, FlexBetween, fixedBottom } from '@styles/theme';
import { TextH3B, TextB2R, TextH6B, TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import StarRatingComponent from 'react-star-rating-component';
import { SVGIcon, getImageSize } from '@utils/common';
import debounce from 'lodash-es/debounce';
import BorderLine from '@components/Shared/BorderLine';
import TextArea from '@components/Shared/TextArea';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import { SET_ALERT } from '@store/alert';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@components/Shared/Tooltip';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getReviewDetailApi, editMenuReviewApi } from '@api/menu';
import NextImage from 'next/image';

interface IWriteMenuReviewObj {
  imgFiles: string[];
  deletedImgIds: string[];
  rating: number;
  content: string;
}

export const FinishReview = () => {
  return (
    <GreyBg>
      <TextH5B color={theme.white}>+ 300P 적립</TextH5B>
    </GreyBg>
  );
};

const EditReviewPage = ({ reviewId }: any) => {
  const [isShow, setIsShow] = useState(false);
  const [writeMenuReviewObj, setWriteMenuReviewObj] = useState<IWriteMenuReviewObj>({
    imgFiles: [],
    deletedImgIds: [],
    rating: 5,
    content: '',
  });

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  /* TODO: text area 1000 넘었을 때 */
  /* TODO: blob 타입 정의 */
  /* TODO: 사이즈 체크 및 사진 올리는 hooks */
  /* TODO: 상수 파일에서 관리 */

  const {
    data: selectedReviewDetail,
    error: menuError,
    isLoading,
  } = useQuery(
    'getReviewDetail',
    async () => {
      const { data } = await getReviewDetailApi(reviewId);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: mutateEditMenuReview } = useMutation(
    async (formData: FormData) => {
      const { data } = await editMenuReviewApi({ formData, reviewId });
    },
    {
      onSuccess: async () => {
        dispatch(
          SET_ALERT({
            children: (
              <GreyBg>
                <TextH5B>+ 300P 적립</TextH5B>
              </GreyBg>
            ),
            alertMessage: '제이미님의 소중한 후기에 감사드려요!',
            submitBtnText: '확인',
          })
        );
      },
    }
  );

  const onStarHoverRating = (nextValue: number, prevValue: number, name: string, e?: any) => {
    const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;

    if (xPos <= 0.5) {
      nextValue -= 0.5;
    }

    setWriteMenuReviewObj({ ...writeMenuReviewObj, rating: nextValue });
  };

  const writeReviewHandler = debounce(() => {
    if (textAreaRef.current) {
      setWriteMenuReviewObj({ ...writeMenuReviewObj, content: textAreaRef.current?.value });
    }
  }, 80);

  const onChangeFileHandler = (e: any) => {
    const LIMIT_SIZE = 5 * 1024 * 1024;

    try {
      if (e.target.files.length > 0) {
        let imageFile = e.target.files;

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
    setWriteMenuReviewObj({
      ...writeMenuReviewObj,
      imgFiles: [...writeMenuReviewObj.imgFiles, imageFile],
    });

    const imageFileReader = new FileReader();

    imageFileReader.onload = (e: any) => {
      setWriteMenuReviewObj({ ...writeMenuReviewObj, imgFiles: [...writeMenuReviewObj.imgFiles, e.target.result] });
    };

    imageFileReader.readAsDataURL(imageFile);
  };

  const removePreviewImgHandler = (index: number) => {
    const filterPreviewImg = writeMenuReviewObj.imgFiles.filter((img, idx) => idx !== index);
    setWriteMenuReviewObj({ ...writeMenuReviewObj, imgFiles: filterPreviewImg });
  };

  const finishWriteReview = async () => {
    /* TODO: 리뷰 등록 물어봐야 함 */
    let formData = new FormData();

    if (writeMenuReviewObj.imgFiles.length > 0) {
      for (let i = 0; i < writeMenuReviewObj.imgFiles.length; i++) {
        formData.append('files' + '[' + i + ']', writeMenuReviewObj.imgFiles[i]);
      }
    }

    const menuReviewImages = { height: 0, main: true, name: 'string', priority: 0, size: 0, width: 0 };

    formData.append('content', writeMenuReviewObj.content);
    formData.append('menuReviewImages', JSON.stringify([menuReviewImages]));
    formData.append('rating', writeMenuReviewObj.rating.toString());

    mutateEditMenuReview(formData);
  };

  useEffect(() => {
    if (selectedReviewDetail) {
      setWriteMenuReviewObj({
        ...writeMenuReviewObj,
        content: selectedReviewDetail.searchReview.content,
        rating: selectedReviewDetail.searchReview.rating,
        imgFiles: selectedReviewDetail.searchReview.images?.map((img) => img.url),
      });
    }
  }, [selectedReviewDetail]);

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
        <FlexCol padding="16px 0 24px 0">
          <TextH3B>제이미님</TextH3B>
          <TextH3B>구매하신 상품은 만족하셨나요?</TextH3B>
        </FlexCol>
        <FlexRow>
          <ImgWrapper>
            <NextImage
              src={IMAGE_S3_URL + selectedReviewDetail?.menuImage.url}
              alt="상품이미지"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              className="rounded"
            />
          </ImgWrapper>
          <TextWrapper>
            <TextB2R padding="0 0 0 16px">{selectedReviewDetail?.searchReview.menuName}</TextB2R>
          </TextWrapper>
        </FlexRow>
        <RateWrapper>
          <StarRatingComponent
            name="rate"
            editing
            starCount={5}
            value={writeMenuReviewObj.rating}
            onStarHover={onStarHoverRating}
            renderStarIcon={(index, value) => {
              return <SVGIcon name={index <= value ? 'reviewStarFull' : 'reviewStarEmpty'} />;
            }}
            renderStarIconHalf={(index, value) => {
              return <SVGIcon name="reviewStarHalf" />;
            }}
          />
          <TextH6B color={theme.greyScale45} padding="8px 0 0 0">
            터치하여 별점을 선택해주세요.
          </TextH6B>
        </RateWrapper>
        <TextArea
          name="reviewArea"
          placeholder="placeholder"
          minLength={0}
          maxLength={1000}
          rows={20}
          eventHandler={writeReviewHandler}
          ref={textAreaRef}
          value={writeMenuReviewObj?.content}
        />
        <FlexBetween margin="8px 0 0 0">
          <TextB3R color={theme.brandColor}>
            {30 - writeMenuReviewObj?.content.length > 0 &&
              `${30 - writeMenuReviewObj?.content.length}자만 더 쓰면 포인트 적립 조건 충족!`}
          </TextB3R>
          <TextB3R>{writeMenuReviewObj?.content.length}/1000</TextB3R>
        </FlexBetween>
      </Wrapper>
      <BorderLine height={8} margin="32px 0" />
      <UploadPhotoWrapper>
        <Tooltip message={'사진과 함께 등록 시 300원 적립!'} top="-45px" width="200px" left="20px" />
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
          {writeMenuReviewObj.imgFiles.length < 2 && (
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

          {writeMenuReviewObj.imgFiles.length > 0 &&
            writeMenuReviewObj.imgFiles.map((img: string, index: number) => {
              return (
                <PreviewImgWrapper key={index}>
                  <img src={img} />
                  <div className="svgWrapper" onClick={() => removePreviewImgHandler(index)}>
                    <SVGIcon name="blackBackgroundCancel" />
                  </div>
                </PreviewImgWrapper>
              );
            })}
        </FlexRow>
      </UploadPhotoWrapper>
      <PointInfoWrapper>
        <TextH5B color={theme.greyScale65}>포인트 적립 유의사항</TextH5B>
        <BorderLine height={1} margin="16px 0" />
        <TextH6B color={theme.greyScale65}>
          [샐러드/건강간식/세트 상품] 수령일 기준 7일 내 제품만 등록 가능합니다.
        </TextH6B>
        <FlexCol>
          <TextB3R color={theme.greyScale65}>[정기배송 상품] 2회 수령 후 30일 내 등록 가능합니다.</TextB3R>
          <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
            후기 작성일 기준 2-3일 내 적립금이 자동 지급됩니다. (영업일 외 명절 및 공휴일은 지연될 수 있음)
          </TextB3R>
          <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
            상품마다 개별 작성건만 적립됩니다.
          </TextB3R>
          <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
            사진 후기는 자사 제품 사진의 경우만 해당합니다.
          </TextB3R>
          <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
            비방성, 광고글, 문의사항 후기는 관리자 임의로 삭제될 수 있습니다.
          </TextB3R>
          <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
            상품을 교환하여 후기를 수정하거나 추가 작성하는 경우 추가 적립금 미지급됩니다.
          </TextB3R>
        </FlexCol>
      </PointInfoWrapper>
      <BtnWrapper onClick={finishWriteReview}>
        <Button height="100%">작성하기</Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;
const ImgWrapper = styled.div`
  width: 30%;
  .rounded {
    border-radius: 8px;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  width: 100%;
`;

const RateWrapper = styled.div`
  padding: 16px 0 24px 0;
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
  }

  .svgWrapper {
    svg {
      position: absolute;
      right: 10%;
      top: 10%;
    }
  }
`;

const PointInfoWrapper = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  margin-bottom: 105px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;

const GreyBg = styled.div`
  height: 110px;
  width: 100%;
  background-color: #c4c4c4;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export async function getServerSideProps(context: any) {
  const { reviewId } = context.query;
  return {
    props: { reviewId },
  };
}

export default EditReviewPage;
