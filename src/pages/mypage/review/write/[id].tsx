import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReviewInfo from '@components/Pages/Mypage/Review/ReviewInfo';
import {
  homePadding,
  FlexCol,
  FlexRow,
  theme,
  FlexBetween,
} from '@styles/theme';
import {
  TextH3B,
  TextB2R,
  TextH6B,
  TextB3R,
  TextB4R,
} from '@components/Shared/Text';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import StarRatingComponent from 'react-star-rating-component';
import SVGIcon from '@utils/SVGIcon';
import debounce from 'lodash-es/debounce';
import BorderLine from '@components/Shared/BorderLine';
import TextArea from '@components/Shared/TextArea';
import TextInput from '@components/Shared/TextInput';
import { getImageSize } from '@utils/getImageSize';

interface IWriteMenuReviewObj {
  dateId: number;
  detailId: number;
  imgFiles: string[];
  deletedImgIds: string[];
  content: string;
  rating: number;
}

function WriteReviewPage({ id }: any) {
  const [isShow, setIsShow] = useState(false);
  const [item, setItem] = useState<any>({});
  const [rating, setRating] = useState<number>(5);
  const [numberOfReivewContent, setNumberOfReivewContent] = useState<number>(0);
  const [previewImg, setPreviewImg] = useState<string[]>([]);
  const [writeMenuReviewObj, setWriteMenuReviewObj] =
    useState<IWriteMenuReviewObj>({
      dateId: 0,
      detailId: 0,
      imgFiles: [],
      deletedImgIds: [],
      content: '',
      rating: 5,
    });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  /* TODO: text area 1000 넘었을 때 */
  /* TODO: blob 타입 정의 */
  /* TODO: 사이즈 체크 및 사진 올리는 hooks */

  useEffect(() => {
    getItemForReview();
  }, []);

  const getItemForReview = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    const selectedItem: any = data.find((item: any) => item.id === Number(id));
    setItem(selectedItem);
  };

  const onStarHoverRating = (
    nextValue: number,
    prevValue: number,
    name: string,
    e?: any
  ) => {
    const xPos =
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.offsetWidth;
    if (xPos <= 0.5) {
      nextValue -= 0.5;
    }

    setRating(nextValue);
  };

  const writeReviewHandler = debounce(() => {
    if (textAreaRef.current) {
      setNumberOfReivewContent(textAreaRef.current?.value.length);
    }
  }, 50);

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
            const [formatWidth, formatHeight] = getImageSize(
              img,
              MAX_WIDTH,
              MAX_HEIGHT
            );
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
      setPreviewImg([...previewImg, e.target.result]);
    };

    imageFileReader.readAsDataURL(imageFile);
  };

  const removePreviewImgHandler = (index: number) => {
    const filterPreviewImg = previewImg.filter((img, idx) => idx !== index);
    setPreviewImg(filterPreviewImg);
  };

  if (!Object.keys(item).length) {
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
            <MenuImg src={item.url} />
          </ImgWrapper>
          <TextB2R width="70%" padding="0 0 0 16px">
            {item.name}
          </TextB2R>
        </FlexRow>
        <RateWrapper>
          <StarRatingComponent
            name="rate"
            editing
            starCount={5}
            value={rating}
            onStarHover={onStarHoverRating}
            renderStarIcon={(index, value) => {
              return (
                <SVGIcon
                  name={index <= value ? 'reviewStarFull' : 'reviewStarEmpty'}
                />
              );
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
        />
        <FlexBetween margin="8px 0 0 0">
          <TextB3R color={theme.brandColor}>
            {30 - numberOfReivewContent}자만 더 쓰면 포인트 적립 조건 충족!
          </TextB3R>
          <TextB3R>{numberOfReivewContent}/1000</TextB3R>
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
            자사 제품과 무관한 사진 첨부 시 통보 없이 후기 삭제 및 포인트 회수가
            진행 될 수 있습니다.
          </TextB3R>
        </FlexRow>
        <FlexRow>
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
          {previewImg.length > 0 &&
            previewImg.map((img: string, index: number) => {
              return (
                <PreviewImgWrapper key={index}>
                  <img src={img} />
                  <div
                    className="svgWrapper"
                    onClick={() => removePreviewImgHandler(index)}
                  >
                    <SVGIcon name="blackBackgroundCancel" />
                  </div>
                </PreviewImgWrapper>
              );
            })}
        </FlexRow>
      </UploadPhotoWrapper>
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;
const ImgWrapper = styled.div`
  width: 72px;
`;
const MenuImg = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const RateWrapper = styled.div`
  padding: 16px 0 24px 0;
  > div {
    display: flex;
  }
`;

const UploadPhotoWrapper = styled.div`
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
  margin: 16px 0 48px 0;
  border: none;

  > img {
    width: 100%;
    height: 100%;
  }
  .svgWrapper {
    svg {
      position: absolute;
      right: 10%;
      top: 10%;
    }
  }
`;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id },
  };
}

export default WriteReviewPage;
