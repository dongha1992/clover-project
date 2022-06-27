import React, { useEffect, useState } from 'react';
import { TextB3R, TextH2B, TextH6B, TextH5B, TextH4B, TextB2R } from '@components/Shared/Text';
import { FlexCol, homePadding, FlexRow, theme, FlexBetweenStart, FlexBetween } from '@styles/theme';
import { getCookie, SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { Tag } from '@components/Shared/Tag';
import BorderLine from '@components/Shared/BorderLine';
import router from 'next/router';
import Image from 'next/image';
import newUserImg from '@public/images/img2.png';
import friendPushEventImg from '@public/images/img3.png';
import { IGetOrders, IOrderDeliverie, Obj } from '@model/index';
import { INIT_USER, userForm } from '@store/user';
import { useDispatch, useSelector } from 'react-redux';
import { onUnauthorized } from '@api/Api';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { OrderDashboard } from '@components/Pages/Mypage/OrderDelivery';
import { SubsDashboard } from '@components/Pages/Mypage/Subscription';
import { getOrderInfoApi } from '@api/order';
import { userInvitationApi, getUserInfoApi } from '@api/user';
import isNil from 'lodash-es/isNil';
import { useGetOrders } from 'src/queries/order';
import { removeCookie } from '@utils/common/cookie';
import { SET_LOGIN_SUCCESS } from '@store/user';
interface IMypageMenu {
  title: string;
  count?: number;
  link: string;
  hideBorder?: boolean;
}

const MypagePage = () => {
  const dispatch = useDispatch();
  const { me, isLoginSuccess } = useSelector(userForm);
  const [subsOrders, setSubsOrders] = useState([]);
  const [subsUnpaidOrders, setSubsUnpaidOrders] = useState([]);
  const [subsCloseOrders, setSubsCloseOrders] = useState([]);

  const { data: orderList, isLoading } = useQuery(
    'getOrderLists',
    async () => {
      const params = {
        orderType: 'GENERAL',
      };

      const { data } = await getOrderInfoApi(params);
      return data.data;
    },
    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { isLoading: subsOrdersLoading } = useGetOrders(
    ['getSubscriptionOrders'],
    { days: 90, page: 1, size: 100, type: 'SUBSCRIPTION' },
    {
      onSuccess: async (data) => {
        const orders = await data.orders
          .map((item: any) => {
            if (item.id === 723074) {
              item.subscriptionRound = 3;
              item.status = 'UNPAID';
            } else if (item.id === 723075) {
              item.subscriptionRound = 2;
              item.status = 'UNPAID';
            } else if (item.id === 723152 || item.id === 723033 || item.id === 723038) {
              item.status = 'UNPAID';
            } else if (item.id === 723082) {
              item.unsubscriptionType = 'PAYMENT_FAILED';
            }
            return item;
          })
          .sort((a: IGetOrders, b: IGetOrders) => {
            if (a.subscriptionRound! > b.subscriptionRound!) return -1;
            if (a.subscriptionRound! < b.subscriptionRound!) return 1;
            if (
              Number(a.firstDeliveryDateOrigin?.replaceAll('-', '')) >
              Number(b.firstDeliveryDateOrigin?.replaceAll('-', ''))
            )
              return 1;
            if (
              Number(a.firstDeliveryDateOrigin?.replaceAll('-', '')) <
              Number(b.firstDeliveryDateOrigin?.replaceAll('-', ''))
            )
              return -1;
          })
          .filter((order: IGetOrders) => order.status !== 'COMPLETED' && order.status !== 'CANCELED');
        const unpaidOrders = orders.filter((order: IGetOrders) => order.status === 'UNPAID');
        const closeOrders = orders.filter(
          (order: IGetOrders) =>
            order.isSubscribing === false &&
            order.subscriptionPeriod === 'UNLIMITED' &&
            (order.unsubscriptionType === 'DISABLED_DESTINATION' ||
              order.unsubscriptionType === 'DISABLED_MENU' ||
              order.unsubscriptionType === 'PAYMENT_FAILED' ||
              order.unsubscriptionType === 'USER_CANCEL')
        );

        setSubsCloseOrders(closeOrders);
        setSubsUnpaidOrders(unpaidOrders);
        setSubsOrders(orders);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { data: friendInvitation, error } = useQuery(
    'getInvitationInfo',
    async () => {
      const { data } = await userInvitationApi();

      return data.data;
    },

    {
      onSuccess: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { data: userInfo, isLoading: infoLoading } = useQuery(
    'getUserInfo',
    async () => {
      const { data } = await getUserInfoApi();

      if (data.code === 200) {
        return data.data;
      } else {
        router.replace('/onboarding');
      }
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
      onError: () => {
        router.replace('/onboarding');
      },
    }
  );

  const goToEditUserInfo = () => {
    if (me?.joinType! !== 'EMAIL') {
      router.push('/mypage/profile');
    } else {
      router.push('/mypage/profile/confirm');
    }
  };

  const logoutHandler = () => {
    dispatch(SET_LOGIN_SUCCESS(false));
    dispatch(INIT_USER());
    delete sessionStorage.accessToken;
    removeCookie({ name: 'refreshTokenObj' });
    removeCookie({ name: 'autoL' });
    removeCookie({ name: 'acstk' });
    localStorage.removeItem('persist:nextjs');
    if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout();
    }
    router.push('/mypage');
  };

  if (isNil(orderList) && infoLoading && subsOrdersLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        {me ? (
          // 회원
          <>
            <UserInfoWrapper>
              <FlexRow>
                <TextH2B padding="0 6px 0 0">{me?.name}님은</TextH2B>
                <IconBox onClick={() => goToEditUserInfo()}>
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
                <TextH6B color={theme.greyScale65} pointer>
                  사용 가능한 포인트
                </TextH6B>
                <TextH5B onClick={() => router.push('/mypage/point')} pointer>
                  {userInfo?.availablePoint} P
                </TextH5B>
              </FlexCol>
              <FlexCol width="50%">
                <TextH6B color={theme.greyScale65} pointer>
                  사용 가능한 쿠폰
                </TextH6B>
                <TextH5B onClick={() => router.push('/mypage/coupon')} pointer>
                  {userInfo?.availableCoupons.length} 개
                </TextH5B>
              </FlexCol>
            </FlexBetweenStart>
            <BorderLine height={8} />
            <OrderAndDeliveryWrapper>{orderList && <OrderDashboard orderList={orderList} />}</OrderAndDeliveryWrapper>
            <SubsDashboard
              subsOrders={subsOrders}
              subsUnpaidOrders={subsUnpaidOrders}
              subsCloseOrders={subsCloseOrders}
            />
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
              <LogoutWrapper onClick={logoutHandler}>
                <FlexBetween padding="24px 0">
                  <TextH4B>로그아웃</TextH4B>
                </FlexBetween>
              </LogoutWrapper>
            </ManageWrapper>
          </>
        ) : (
          // 비회원
          <>
            <UserInfoWrapper className="hideBorder">
              <FlexRow onClick={() => onUnauthorized()}>
                <TextH2B padding="0 6px 0 0">로그인을 해주세요</TextH2B>
                <IconBox>
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

const LogoutWrapper = styled.div`
  cursor: pointer;
  padding: 0 24px;
  list-style: none;
  > div {
    border-bottom: 1px solid ${theme.greyScale3};
  }
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
