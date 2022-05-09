import React, { useState } from 'react';
import { TextB3R, TextH2B, TextH6B, TextH5B, TextH4B, TextB2R, TextH3B, TextB4R } from '@components/Shared/Text';
import { FlexCol, homePadding, FlexRow, theme, FlexBetweenStart, FlexBetween, FlexColCenter } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { Tag } from '@components/Shared/Tag';
import BorderLine from '@components/Shared/BorderLine';
import router from 'next/router';
import Image from 'next/image';
import newUserImg from '@public/images/img2.png';
import friendPushEventImg from '@public/images/img3.png';
import { Obj } from '@model/index';
import { userForm } from '@store/user';
import { useSelector } from 'react-redux';
import { onUnauthorized } from '@api/Api';
import Link from 'next/link';
import { useQuery, useQueryClient } from 'react-query';
import { OrderDashboard } from '@components/Pages/Mypage/OrderDelivery';
import { SubsDashboard } from '@components/Pages/Mypage/Subscription';
import { getOrderListsApi, getOrderInfoApi } from '@api/order';
import { userInvitationApi } from '@api/user';
import { getPointApi } from '@api/point';
import isNil from 'lodash-es/isNil';
interface IMypageMenu {
  title: string;
  count?: number;
  link: string;
  hideBorder?: boolean;
}

const MypagePage = () => {
  const { me, isLoginSuccess } = useSelector(userForm);

  const { data: orderList, isLoading } = useQuery(
    'getOrderLists',
    async () => {
      const params = {
        orderType: 'GENERAL',
      };

      if (isLoginSuccess) {
        const { data } = await getOrderInfoApi(params);
        return data.data;
      }
    },
    {
      onSuccess: (data) => {},
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { data: friendInvitation, error } = useQuery(
    'getInvitationInfo',
    async () => {
      const { data } = await userInvitationApi();
      console.log('friendInvitation');

      return data.data;
    },

    {
      onSuccess: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { data: points, isLoading: pointLoading } = useQuery(
    'getPoint',
    async () => {
      const { data } = await getPointApi();
      if (data.code === 200) {
        return data.data;
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  if (isNil(orderList) && isLoginSuccess) {
    return <div>로딩</div>;
  }

  console.log(me, 'ME');

  return (
    <Container>
      <Wrapper>
        {isLoginSuccess ? (
          // 회원
          <>
            <UserInfoWrapper>
              <FlexRow>
                <TextH2B padding="0 6px 0 0">{me?.nickName}님은</TextH2B>
                <IconBox onClick={() => router.push('/mypage/profile/confirm')}>
                  <SVGIcon name="arrowRight" />
                </IconBox>
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
                <TextH6B
                  color={theme.greyScale65}
                  textDecoration="underline"
                  onClick={() => router.push('/mypage/rank')}
                  pointer
                >
                  등급 안내
                </TextH6B>
              </FlexBetween>
            </UserInfoWrapper>
            <FlexBetweenStart padding="16px 24px 32px">
              <FlexCol width="50%">
                <TextH6B color={theme.greyScale65}>사용 가능한 포인트</TextH6B>
                <TextH5B onClick={() => router.push('/mypage/point')}>{me?.point} P</TextH5B>
              </FlexCol>
              <FlexCol width="50%">
                <TextH6B color={theme.greyScale65}>사용 가능한 쿠폰</TextH6B>
                <TextH5B onClick={() => router.push('/mypage/coupon')}>0 개</TextH5B>
              </FlexCol>
            </FlexBetweenStart>
            <BorderLine height={8} />
            <OrderAndDeliveryWrapper>{orderList && <OrderDashboard orderList={orderList!} />}</OrderAndDeliveryWrapper>
            <SubsDashboard />
            <ManageWrapper>
              <MypageMenu title="스팟 관리" link="/mypage/spot-status" />
              <MypageMenu title="후기 관리" link="/mypage/review" />
              <MypageMenu title="찜 관리" link="/mypage/dib/general" count={1} />
              <MypageMenu title="친구 초대" link="/mypage/friend" count={friendInvitation?.joinCount} />
              <MypageMenu title="주소 관리" link="/mypage/address" />
              <MypageMenu title="결제 관리" link="/mypage/card" />
              <MypageMenu title="이벤트" link="/mypage/event" />
              <MypageMenu title="배송 안내" link="/mypage/deliver-infomation" hideBorder />
              <ImageWrapper>
                <Image
                  width={340}
                  height={96}
                  layout="responsive"
                  objectFit="cover"
                  src="http://www.newsworks.co.kr/news/photo/202011/502748_392695_2953.jpg"
                  alt="Friend invitation banner"
                />
              </ImageWrapper>
              <MypageMenu title="고객센터" link="/mypage/customer-service" />
              <MypageMenu title="앱설정" link="/mypage/setting" />
              <MypageMenu title="약관 및 정책" link="/mypage/term" hideBorder />
            </ManageWrapper>
          </>
        ) : (
          // 비회원
          <>
            <UserInfoWrapper className="hideBorder">
              <FlexRow>
                <TextH2B padding="0 6px 0 0">로그인을 해주세요</TextH2B>
                <IconBox onClick={() => onUnauthorized()}>
                  <SVGIcon name="arrowRight" />
                </IconBox>
              </FlexRow>
              <FlexBetween padding="8px 0 0 0">
                <FlexRow>
                  <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
                    회원가입하고 신규회원 특별 혜택 받아보세요!
                  </TextB3R>
                </FlexRow>
                <TextH6B
                  color={theme.greyScale65}
                  textDecoration="underline"
                  onClick={() => router.push('/mypage/rank')}
                  pointer
                >
                  등급 안내
                </TextH6B>
              </FlexBetween>
            </UserInfoWrapper>
            <ManageWrapper>
              <ImageWrapper>
                <Link href="/mypage/friend">
                  <a>
                    <Image
                      width={360}
                      height={96}
                      layout="responsive"
                      objectFit="cover"
                      src={newUserImg}
                      alt="new member event"
                    />
                  </a>
                </Link>
              </ImageWrapper>
              <ImageWrapper className="last">
                <Link href="/mypage/friend">
                  <a>
                    <Image
                      width={360}
                      height={96}
                      layout="responsive"
                      objectFit="cover"
                      src={friendPushEventImg}
                      alt="Friend invitation banner"
                    />
                  </a>
                </Link>
              </ImageWrapper>
              <MypageMenu title="고객센터" link="/mypage/customer-service" />
              <MypageMenu title="앱설정" link="/mypage/setting" />
              <MypageMenu title="약관 및 정책" link="/mypage/term" hideBorder />
            </ManageWrapper>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export const MypageMenu = React.memo(({ title, count, link, hideBorder }: IMypageMenu) => {
  const mapper: Obj = {
    '구독 관리': '개',
    '찜 관리': '건',
    '친구 초대': '명',
  };
  return (
    <MypageItem onClick={() => router.push(link)} className={`${hideBorder && 'hideBorder'}`}>
      <FlexBetween padding="24px 0">
        <TextH4B>{title}</TextH4B>
        <FlexRow>
          <TextB2R padding="0 8px 0 0">
            {count}
            {mapper[title]}
          </TextB2R>
          <div>
            <SVGIcon name="arrowRight" />
          </div>
        </FlexRow>
      </FlexBetween>
    </MypageItem>
  );
});
MypageMenu.displayName = 'MypageMenu';

const Container = styled.div`
  .hideBorder {
    border-bottom: none;
  }
`;

const Wrapper = styled.div`
  margin-bottom: 158px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${homePadding}
  padding-top: 24px;
  padding-bottom: 32px;
  border-bottom: 1px solid ${theme.greyScale3};
`;

const OrderAndDeliveryWrapper = styled.div`
  ${homePadding}
  padding-top: 32px;
`;

const SubscriptionWrapper = styled.div`
  ${homePadding}
  padding-top: 32px;
`;

const ManageWrapper = styled.ul``;
const MypageItem = styled.li`
  cursor: pointer;
  padding: 0 24px;
  list-style: none;
  > div {
    border-bottom: 1px solid ${theme.greyScale3};
  }
`;
const ImageWrapper = styled.li`
  &.last {
    padding-top: 8px;
  }
`;

const IconBox = styled.div`
  display: flex;
  cursor: pointer;
`;

export default MypagePage;
