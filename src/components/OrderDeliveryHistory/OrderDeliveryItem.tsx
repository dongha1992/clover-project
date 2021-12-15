import { FlexBetween, FlexCol, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R } from '@components/Text';
import Tag from '@components/Tag';
import SVGIcon from '@utils/SVGIcon';
import Button from '@components/Button';

interface IProps {
  menu: any;
}

function OrderDeliveryItem({ menu }: IProps) {
  return (
    <Container>
      <Wrapper>
        <FlexRow margin="0 0 8px 0">
          <TextH5B color={theme.brancColor}>주문완료</TextH5B>
          <Tag margin="0 4px 0 8px">스팟배송</Tag>
          <Tag>점심</Tag>
        </FlexRow>
        <FlexRow>
          <SVGIcon name="deliveryTruckIcon" />
          <TextH5B>11월 4일 (목) 도착예정</TextH5B>
        </FlexRow>
        <FlexRow padding="0 0 16px 0">
          <ImageWrapper>
            <ItemImage src={menu.url} alt="상품이미지" />
          </ImageWrapper>
          <FlexCol padding="0 0 0 16px">
            <TextB2R padding="0 0 4px 0">
              프렌치 발사믹 훈제연어 샐러드 / 미디움 (M) 1개 외 4개
            </TextB2R>
            <FlexBetween>
              <TextH5B>32,610원</TextH5B>
              <TextB3R color={theme.greyScale65}>11월 2일 (화) 결제</TextB3R>
            </FlexBetween>
          </FlexCol>
        </FlexRow>
        <FlexRow>
          <Button>장바구니 담기</Button>
          <Button>주문상세 보기</Button>
        </FlexRow>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;

const Wrapper = styled.div`
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

export default OrderDeliveryItem;
