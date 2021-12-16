import {
  TextB3R,
  TextH2B,
  TextH6B,
  TextH5B,
  TextH4B,
  TextB2R,
  TextH3B,
  TextB4R,
} from '@components/Text';
import {
  FlexCol,
  homePadding,
  FlexRow,
  theme,
  FlexBetweenStart,
  FlexBetween,
  FlexColCenter,
} from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import React from 'react';
import styled from 'styled-components';
import Tag from '@components/Tag';
import BorderLine from '@components/BorderLine';
import router from 'next/router';
import Image from 'next/image';
import { Obj } from '@model/index';
interface IMypageMenu {
  title: string;
  count?: number;
  link: string;
  hideBorder?: boolean;
}

function mypage() {
  return (
    <Container>
      <Wrapper>
        <UserInfoWrapper>
          <FlexRow>
            <TextH2B padding="0 6px 0 0">루이스님</TextH2B>
            <div onClick={() => router.push('/mypage/profile/confirm')}>
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
          <FlexBetween padding="8px 0 0 0">
            <FlexRow>
              <Tag color={theme.brandColor} margin="0 8px 0 0">
                프코회원
              </Tag>
              <TextB3R color={theme.brandColor} padding="2px 0 0 0">
                다음 등급까지 12,000원 남았어요
              </TextB3R>
            </FlexRow>
            <TextH6B color={theme.greyScale65}>등급 안내</TextH6B>
          </FlexBetween>
        </UserInfoWrapper>
        <BorderLine height={1} margin="35px 0 16px 0" />
        <FlexBetweenStart padding="0 24px">
          <FlexCol width="50%">
            <TextH6B color={theme.greyScale65}>사용 가능한 포인트</TextH6B>
            <TextH5B>0 P</TextH5B>
          </FlexCol>
          <FlexCol width="50%">
            <TextH6B color={theme.greyScale65}>사용 가능한 쿠폰</TextH6B>
            <TextH5B>0 개</TextH5B>
          </FlexCol>
        </FlexBetweenStart>
        <BorderLine height={8} margin="32px 0 32px 0" />
        <OrderAndDeliveryWrapper>
          <FlexCol>
            <FlexBetween>
              <TextH4B>주문/배송 내역</TextH4B>
              <FlexRow>
                <TextB2R padding="0 8px 0 0">2 건</TextB2R>
                <div
                  onClick={() => router.push('/mypage/order-delivery-history')}
                >
                  <SVGIcon name="arrowRight" />
                </div>
              </FlexRow>
            </FlexBetween>
            <DeliveryDiagram>
              <FlexBetween padding="20px 21px 15px 21px">
                <FlexColCenter>
                  <TextH3B>0</TextH3B>
                  <TextB4R color={theme.greyScale65}>주문완료</TextB4R>
                </FlexColCenter>
                <ArrowWrapper>
                  <SVGIcon name="arrowRightGrey" />
                </ArrowWrapper>
                <FlexColCenter>
                  <TextH3B>0</TextH3B>
                  <TextB4R color={theme.greyScale65}>상품준비중</TextB4R>
                </FlexColCenter>
                <ArrowWrapper>
                  <SVGIcon name="arrowRightGrey" />
                </ArrowWrapper>
                <FlexColCenter>
                  <TextH3B>0</TextH3B>
                  <TextB4R color={theme.greyScale65}>배송중</TextB4R>
                </FlexColCenter>
                <ArrowWrapper>
                  <SVGIcon name="arrowRightGrey" />
                </ArrowWrapper>
                <FlexColCenter>
                  <TextH3B>0</TextH3B>
                  <TextB4R color={theme.greyScale65}>배송완료</TextB4R>
                </FlexColCenter>
              </FlexBetween>
            </DeliveryDiagram>
          </FlexCol>
        </OrderAndDeliveryWrapper>
        <ManageWrapper>
          <MypageMenu title="구독 관리" link="/mypage/subscrition" count={1} />
          <MypageMenu title="스팟 관리" link="/mypage/spot" />
          <MypageMenu title="후기 관리" link="/mypage/review" />
          <MypageMenu title="찜 관리" link="/mypage/dib/general" count={1} />
          <MypageMenu title="친구 초대" link="/mypage/friend" count={1} />
          <MypageMenu title="주소 관리" link="/mypage/address" />
          <MypageMenu title="결제 관리" link="/mypage/card" />
          <MypageMenu title="이벤트" link="/mypage/event" />
          <MypageMenu
            title="배송 안내"
            link="/mypage/deliver-infomation"
            hideBorder
          />
          <ImageWrapper>
            <Image
              width={340}
              height={96}
              layout="responsive"
              objectFit="cover"
              src="http://www.newsworks.co.kr/news/photo/202011/502748_392695_2953.jpg"
            />
          </ImageWrapper>
          <MypageMenu title="고객센터" link="/mypage/customer-service" />
          <MypageMenu title="약관 및 정책" link="/mypage/term" hideBorder />
        </ManageWrapper>
      </Wrapper>
    </Container>
  );
}

export const MypageMenu = React.memo(
  ({ title, count, link, hideBorder }: IMypageMenu) => {
    const mapper: Obj = {
      '구독 관리': '개',
      '찜 관리': '건',
      '친구 초대': '명',
    };
    return (
      <FlexCol padding="0 24px">
        <FlexBetween>
          <TextH4B>{title}</TextH4B>
          <FlexRow>
            {count && (
              <TextB2R padding="0 8px 0 0">
                {count}
                {mapper[title]}
              </TextB2R>
            )}
            <div onClick={() => router.push(link)}>
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
        </FlexBetween>
        {!hideBorder && <BorderLine height={1} margin="24px 0" />}
      </FlexCol>
    );
  }
);

const Container = styled.div``;

const Wrapper = styled.div`
  margin-bottom: 158px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${homePadding}
`;

const OrderAndDeliveryWrapper = styled.div`
  margin-bottom: 25px;
  ${homePadding}
`;

const DeliveryDiagram = styled.div`
  background-color: ${theme.greyScale3};
  margin-top: 15px;
  border-radius: 8px;
`;

const ArrowWrapper = styled.div`
  padding-bottom: 16px;
`;

const ManageWrapper = styled.div``;
const ImageWrapper = styled.div`
  padding: 24px 0;
`;

export default mypage;
