import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReviewInfo from '@components/Pages/mypage/review/ReviewInfo';
import {
  homePadding,
  FlexCol,
  FlexRow,
  theme,
  FlexColStart,
} from '@styles/theme';
import { TextH3B, TextB2R, TextH6B } from '@components/Text';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import StarRatingComponent from 'react-star-rating-component';
import SVGIcon from '@utils/SVGIcon';

function writeReview({ id }: any) {
  const [isShow, setIsShow] = useState(false);
  const [item, setItem] = useState<any>({});
  const [rating, setRating] = useState<number>(5);

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
  console.log(rating);
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
          <TextH6B
            textDecoration="underline"
            color={theme.greyScale45}
            padding="8px 0 0 0"
          >
            터치하여 별점을 선택해주세요.
          </TextH6B>
        </RateWrapper>
      </Wrapper>
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
  padding: 16px 0 0 0;
  > div {
    display: flex;
  }
`;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id },
  };
}

export default writeReview;
