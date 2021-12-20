import { FlexBetween, FlexCol, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import SVGIcon from '@utils/SVGIcon';
import Button from '@components/Shared/Button';
import router from 'next/router';

interface IProps {
  menu: any;
}

function MypageReviewItem({ menu }: IProps) {
  return (
    <Container>
      <Wrapper>
        <FlexRow margin="0 0 8px 0">
          <TextH5B color={theme.brandColor}>주문완료</TextH5B>
          <Tag margin="0 4px 0 8px">스팟배송</Tag>
          <Tag>점심</Tag>
        </FlexRow>
        <FlexRow padding="0 0 8px 0">
          <SVGIcon name="deliveryTruckIcon" />
          <TextH5B padding="2px 0 0 4px">11월 4일 (목) 도착</TextH5B>
        </FlexRow>
        <FlexRow padding="0 0 16px 0">
          <ImageWrapper>
            <ItemImage src={menu.url} alt="상품이미지" />
          </ImageWrapper>
          <FlexCol width="70%" margin="0 0 0 16px">
            <TextB2R padding="0 0 4px 0">{menu.name}</TextB2R>
            <FlexBetween>
              <TextH5B>{menu.price}원</TextH5B>
              <TextB3R color={theme.greyScale65}>
                11월 2일 (화) 까지 작성
              </TextB3R>
            </FlexBetween>
          </FlexCol>
        </FlexRow>
        <FlexRow>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="0 8px 0 0"
            onClick={() => router.push(`/mypage/review/write/${menu.id}`)}
          >
            후기 작성하기
          </Button>
        </FlexRow>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default MypageReviewItem;
