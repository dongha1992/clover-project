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

function writeReview({ id }: any) {
  const [isShow, setIsShow] = useState(false);
  const [item, setItem] = useState<any>({});
  const [rating, setRating] = useState<number>(5);
  const [numberOfReivewContent, setNumberOfReivewContent] = useState<number>(0);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
        <ReviewTextForm>
          <TextArea
            name="name"
            placeholder="placeholder"
            minLength={0}
            maxLength={1000}
            rows={20}
            onChange={writeReviewHandler}
            ref={textAreaRef}
          />
        </ReviewTextForm>
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
        <UploadInputWrapper>{/* <UploadInput /> */}</UploadInputWrapper>
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

const ReviewTextForm = styled.div``;

const TextArea = styled.textarea`
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 208px;
  border: 1px solid ${theme.greyScale15};
  border-radius: 0;
  box-shadow: 0 0 0;
  background: #fff;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  letter-spacing: -0.4px;
  padding: 16px;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  resize: none;
  border-radius: 8px;
  &:focus {
    border: 1px solid ${theme.greyScale15};
    outline: 0;
  }
  &::-webkit-input-placeholder {
    color: #999;
  }
`;

const UploadPhotoWrapper = styled.div`
  ${homePadding}
`;

const UploadInputWrapper = styled.div``;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id },
  };
}

export default writeReview;
