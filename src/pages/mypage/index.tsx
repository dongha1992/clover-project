import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { TextB3R, TextH2B, TextH6B, TextH3B, TextH4B } from '@components/Shared/Text';
import { FlexCol, homePadding, FlexRow, theme, FlexBetweenStart, FlexBetween } from '@styles/theme';
import { getFormatPrice, SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { Tag } from '@components/Shared/Tag';
import BorderLine from '@components/Shared/BorderLine';
import router from 'next/router';
import NextImage from 'next/image';
import newUserImg from '@public/images/newUserImg.svg';
import friendPushEventImg from '@public/images/friendPushEventImg.svg';
import { IGetOrders } from '@model/index';
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
import { INIT_CART_LISTS } from '@store/cart';
import { INIT_MENU_ITEM } from '@store/menu';
import { INIT_DESTINATION, INIT_USER_DELIVERY_TYPE } from '@store/destination';
import { commonSelector } from '@store/common';
import { show, hide } from '@store/loading';
import { SET_ALERT } from '@store/alert';
import useIsApp from '@hooks/useIsApp';
import DefaultLayout from '@components/Layout/Default';
import HomeBottom from '@components/Bottom/HomeBottom';
import { NextPageWithLayout } from '@pages/_app';

interface IMypageMenu {
  title: string;
  count?: number;
  link: string;
  hideBorder?: boolean;
}

const MypagePage: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const { me } = useSelector(userForm);
  const { loginType } = useSelector(commonSelector);
  const [subsOrders, setSubsOrders] = useState([]);
  const [subsUnpaidOrders, setSubsUnpaidOrders] = useState([]);
  const [subsCloseOrders, setSubsCloseOrders] = useState([]);
  const [showBoard, setShowBoard] = useState<string>('');

  const ref = useRef<HTMLDivElement>(null);

  const isApp = useIsApp();
  const { data: orderList } = useQuery(
    'getOrderLists',
    async () => {
      const params = {
        orderType: 'GENERAL',
      };

      const { data } = await getOrderInfoApi(params);
      return data.data;
    },
    {
      onSuccess: () => {},
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { isLoading: subsOrdersLoading } = useGetOrders(
    ['getSubscriptionOrders'],
    { days: 365, page: 1, size: 100, type: 'SUBSCRIPTION' },
    {
      onSuccess: async data => {
        const orders = await data.orders
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

        const unpaidOrders = await orders.filter(
          (order: IGetOrders) => order.status === 'UNPAID' && !!order.isSubscribing && !order.unsubscriptionType
        );

        const closeOrders = await orders.filter(
          (order: IGetOrders) => order.subscriptionPeriod === 'UNLIMITED' && order.unsubscriptionType
        );

        if (closeOrders.length > 0) {
          setShowBoard('close');
        } else if (closeOrders.length === 0 && unpaidOrders.length > 0) {
          setShowBoard('unpaid');
        } else if (orders.length > 0) {
          setShowBoard('progress');
        }

        setSubsCloseOrders(closeOrders);
        setSubsUnpaidOrders(unpaidOrders);
        setSubsOrders(orders);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { data: friendInvitation } = useQuery(
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
        //accessToken ????????? 401 ???????????? refresh????????? ???????????? ?????? ????????????????????? ?????????!!!
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
    dispatch(
      SET_ALERT({
        alertMessage: '???????????? ????????????????',
        submitBtnText: '??????',
        closeBtnText: '??????',
        onSubmit: () => {
          dispatch(INIT_USER());
          dispatch(INIT_CART_LISTS());
          // TEMP, persist ????????? ?????? ?????????
          dispatch(INIT_DESTINATION());
          dispatch(INIT_MENU_ITEM());
          dispatch(INIT_USER_DELIVERY_TYPE());
          removeCookie({ name: 'acstk' });
          removeCookie({ name: 'refreshTokenObj' });
          removeCookie({ name: 'autoL' });
          localStorage.removeItem('persist:nextjs');
          sessionStorage.removeItem('recommendCode');
          if (isApp && window.Kakao && window.Kakao.Auth.getAccessToken()) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-logout-kakao' }));
          } else if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout();
          } else if (isApp && loginType === 'APPLE') {
            window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-logout-apple' }));
          }
          router.push('/mypage');
        },
      })
    );
  };

  return (
    <Container ref={ref}>
      <Wrapper>
        {me ? (
          // ??????
          <>
            <UserInfoWrapper>
              <FlexRow>
                <TextH2B padding="0 6px 0 0">{me?.nickname}???</TextH2B>
                <IconBox onClick={() => goToEditUserInfo()}>
                  <SVGIcon name="arrowRight" />
                </IconBox>
              </FlexRow>
              <FlexBetween padding="8px 0 0 0">
                <FlexRow>
                  <Tag backgroundColor={theme.brandColor5} color={theme.brandColor} margin="0 8px 0 0">
                    {me.grade.name}
                  </Tag>
                  <TextB3R color={theme.brandColor} padding="2px 0 0 0">
                    ?????? ??? ????????? ????????? ????????? ?????????!
                  </TextB3R>
                </FlexRow>
                <TextH6B
                  color={theme.greyScale65}
                  textDecoration="underline"
                  onClick={() => router.push('/mypage/rank')}
                  pointer
                >
                  ?????? ??????
                </TextH6B>
              </FlexBetween>
            </UserInfoWrapper>
            <FlexBetweenStart padding="16px 24px 32px">
              <FlexCol width="50%">
                <TextH6B color={theme.greyScale65} pointer>
                  ?????? ????????? ?????????
                </TextH6B>
                <TextH3B onClick={() => router.push('/mypage/point')} pointer>
                  {getFormatPrice(String(userInfo?.availablePoint))} P
                </TextH3B>
              </FlexCol>
              <FlexCol width="50%">
                <TextH6B color={theme.greyScale65} pointer>
                  ?????? ????????? ??????
                </TextH6B>
                <TextH3B onClick={() => router.push('/mypage/coupon')} pointer>
                  {userInfo?.availableCoupons.length} ???
                </TextH3B>
              </FlexCol>
            </FlexBetweenStart>
            <BorderLine height={8} />
            <OrderAndDeliveryWrapper>{orderList && <OrderDashboard orderList={orderList} />}</OrderAndDeliveryWrapper>
            <SubsDashboard
              subsOrders={subsOrders}
              subsUnpaidOrders={subsUnpaidOrders}
              subsCloseOrders={subsCloseOrders}
              showBoard={showBoard}
            />
            <ManageWrapper>
              <MypageMenu title="?????? ??????" link="/mypage/review/schedule" />
              <MypageMenu title="?????? ??????" link="/mypage/dib/general" hideBorder />
              <BorderLine height={8} />
              <MypageMenu title="???????????? ??????" link="/mypage/spot/status" />
              <MypageMenu title="????????? ??????" link="/mypage/address/delivery" />
              <MypageMenu title="?????? ??????" link="/mypage/card" />
              <MypageMenu title="?????? ??????" link="/mypage/friend" count={friendInvitation?.joinCount} />
              <ImageWrapper>
                <Link href="/mypage/friend">
                  <a>
                    <NextImage
                      height="131px"
                      width="512px"
                      layout="responsive"
                      src={friendPushEventImg}
                      alt="Friend invitation banner"
                    />
                  </a>
                </Link>
              </ImageWrapper>
              <MypageMenu title="?????????????????" link="/event" />
              <MypageMenu title="????????????" link="/mypage/delivery-infomation" hideBorder />
              <MypageMenu title="????????????" link="/mypage/customer-service" />
              <MypageMenu title="??????" link="/mypage/setting" />
              <MypageMenu title="?????? ??? ??????" link="/mypage/term" hideBorder />
              {/* <MypageMenu title="?????? ??????" link="/mypage/term" hideBorder /> */}
              <BorderLine height={8} />
              <LogoutWrapper onClick={logoutHandler}>
                <FlexBetween padding="24px 0">
                  <TextH4B>????????????</TextH4B>
                </FlexBetween>
              </LogoutWrapper>
            </ManageWrapper>
          </>
        ) : (
          // ?????????
          <>
            <UserInfoWrapper className="hideBorder">
              <FlexRow onClick={() => onUnauthorized()} pointer>
                <TextH2B padding="0 6px 0 0">???????????? ????????????</TextH2B>
                <IconBox>
                  <SVGIcon name="arrowRight" />
                </IconBox>
              </FlexRow>
              <FlexBetween padding="8px 0 0 0">
                <FlexRow>
                  <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
                    ?????????????????? ???????????? ?????? ?????? ???????????????!
                  </TextB3R>
                </FlexRow>
                <TextH6B
                  color={theme.greyScale65}
                  textDecoration="underline"
                  onClick={() => router.push('/mypage/rank')}
                  pointer
                >
                  ?????? ??????
                </TextH6B>
              </FlexBetween>
            </UserInfoWrapper>
            <ManageWrapper>
              <ImageWrapper>
                <Link href="/mypage/friend">
                  <a>
                    <NextImage
                      height="131px"
                      width="512px"
                      layout="responsive"
                      src={newUserImg}
                      alt="new member event"
                    />
                  </a>
                </Link>
              </ImageWrapper>
              <ImageWrapper className="last">
                <Link href="/mypage/friend">
                  <a>
                    <NextImage
                      height="131px"
                      width="512px"
                      layout="responsive"
                      src={friendPushEventImg}
                      alt="Friend invitation banner"
                    />
                  </a>
                </Link>
              </ImageWrapper>
              <MypageMenu title="?????????????????" link="/mypage/event" />
              <MypageMenu title="????????????" link="/mypage/delivery-infomation" />
              <MypageMenu title="????????????" link="/mypage/customer-service" />
              <MypageMenu title="?????? ??? ??????" link="/mypage/term" hideBorder />
            </ManageWrapper>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

MypagePage.getLayout = (page: ReactElement) => {
  return <DefaultLayout bottom={<HomeBottom />}>{page}</DefaultLayout>;
};

export const MypageMenu = React.memo(({ title, count, link, hideBorder }: IMypageMenu) => {
  return (
    <MypageItem onClick={() => router.push(link)} className={`${hideBorder && 'hideBorder'}`}>
      <FlexBetween padding="24px 0">
        <TextH4B>{title}</TextH4B>
        <FlexRow>
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
  /* margin-bottom: 158px; */
`;

const LogoutWrapper = styled.li`
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
  padding: 32px 24px 0 24px;
`;

const SubscriptionWrapper = styled.div`
  ${homePadding}
  padding-top: 32px;
`;

const ManageWrapper = styled.ul`
  & > li:last-of-type > div {
    border-bottom: none;
  }
`;
const MypageItem = styled.li`
  cursor: pointer;
  padding: 0 24px;
  list-style: none;
  &:first-of-type > div {
    border-top: 1px solid ${theme.greyScale3};
  }
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
  padding-top: 3px;
`;

export default MypagePage;
