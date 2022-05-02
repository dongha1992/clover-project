import { SubsCalendarSheet } from '@components/BottomSheet/CalendarSheet';
import BorderLine from '@components/Shared/BorderLine';
import { Button, RadioButton } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { SUBSCRIPTION_PERIOD } from '@constants/subscription';
import { Obj } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { destinationForm } from '@store/destination';
import { subscriptionForm } from '@store/subscription';
import { userForm } from '@store/user';
import { fixedBottom, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import axios from 'axios';
import { isNil } from 'lodash-es';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useQueries, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { INIT_DESTINATION, INIT_TEMP_DESTINATION } from '@store/destination';
import { getMainDestinationsApi } from '@api/destination';
import { SubsDeliveryTypeAndLocation } from '@components/Pages/Subscription';
import { onError } from '@api/Api';
import { getOrderListsApi } from '@api/order';

// TODO(young) : 구독하기 메뉴 상세에서 들어온 구독 타입에 따라 설정해줘야함
const subsDeliveryType: any = 'SPOT';

const SubsSetInfoPage = () => {
  const dispatch = useDispatch();
  const { subsStartDate } = useSelector(subscriptionForm);
  const { isLoginSuccess } = useSelector(userForm);
  const { userDeliveryType, userDestination } = useSelector(destinationForm);
  const [subsDates, setSubsDates] = useState([]);
  const [userSelectPeriod, setUserSelectPeriod] = useState('subscription');
  const [spotMainDestination, setSpotMainDestination] = useState<string | undefined>();

  const goToDeliveryInfo = () => {
    router.push({
      pathname: '/cart/delivery-info',
      query: {
        subsDeliveryType: subsDeliveryType,
        isSubscription: true,
      },
    });
  };

  const { data, isLoading } = useQuery(
    'subsDates',
    async () => {
      const data = await axios.get('http://localhost:9009/api/subsDates');
      return data.data;
    },
    {
      onSuccess: (data) => {
        setSubsDates(data.data.startDates);
      },
    }
  );

  const { data: mainDestinations, isLoading: mainDestinationsLoading } = useQuery(
    'getMainDestinations',
    async () => {
      try {
        if (subsDeliveryType === 'SPOT') {
          if (userDestination) {
            setSpotMainDestination(userDestination.name);
          } else {
            const { data } = await getMainDestinationsApi({
              delivery: 'SPOT',
            });

            setSpotMainDestination(data.data.name);
          }
        }
        // else {
        //   const { data } = await getMainDestinationsApi({
        //     delivery: 'PARCEL',
        //   });
        //   if (!data.data) {
        //     const { data } = await getMainDestinationsApi({
        //       delivery: 'MORNING',
        //     });
        //     return data.data;
        //   } else {
        //     return data.data;
        //   }
        // }
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: recentOrderDelivery } = useQuery(
    'getOrderLists',
    async () => {
      const params = {
        days: 90,
        page: 1,
        size: 100,
        type: 'GENERAL',
      };

      const { data } = await getOrderListsApi(params);
      const filterData = data.data.orderDeliveries.filter((item) => ['PARCEL', 'MORNING'].includes(item.delivery));
      console.log(filterData[0]);
      if (userDestination) {
      }
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const changeRadioHanler = async (value: string) => {
    setUserSelectPeriod(value);
  };

  const calendarSettingHandler = () => {
    if (userDestination) {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <SubsCalendarSheet userSelectPeriod={userSelectPeriod} subsDates={subsDates} />,
        })
      );
    } else {
      dispatch(
        SET_ALERT({
          alertMessage: '픽업장소를 설정해주세요.',
          submitBtnText: '확인',
        })
      );
    }
  };

  const goToRegisterCheck = () => {
    router.push('/subscription/register');
  };

  if (isLoading && mainDestinationsLoading) return <div>...로딩중</div>;
  // TODO : 비로그인시 온보딩 화면으로 리다이렉트
  return (
    <Container>
      <SubsDeliveryTypeAndLocation
        goToDeliveryInfo={goToDeliveryInfo}
        subsDeliveryType={subsDeliveryType}
        spotMainDestination={spotMainDestination}
      />
      <BorderLine height={8} />
      <PeriodBox>
        <TextH4B padding="0 0 24px">구독 기간</TextH4B>
        <RadioWrapper>
          {SUBSCRIPTION_PERIOD.map((item) => {
            const isSelected = userSelectPeriod === item.period;
            return (
              <RadioLi key={item.id}>
                <RadioButton isSelected={isSelected} onChange={() => changeRadioHanler(item.period)} />
                <TextB2R className={`${isSelected && 'fBold'}`} padding="0 0 0 8px">
                  {item.text}
                </TextB2R>
              </RadioLi>
            );
          })}
        </RadioWrapper>
        <SubsInfoBox>
          <div className="textBox">
            <SVGIcon name="exclamationMark" />
            <TextH6B padding="2.5px 0 0 2px" color={theme.brandColor}>
              정기구독 안내
            </TextH6B>
          </div>
          <TextB3R color={theme.brandColor}>
            - 매달 새로운 식단을 자동결제로 편리하게 구독해 보세요. <br />
            - 구독 결제 기간에 따라 할인율이 점차 증가합니다. <br />
            (1개월 5% / 2개월 7% / 3개월 10% / 4개월 15%)
          </TextB3R>
        </SubsInfoBox>
      </PeriodBox>

      <BorderLine height={8} />

      <DateSetting>
        <TextH4B padding="0 0 24px">구독 시작/배송일</TextH4B>
        <Button border backgroundColor="#fff" color={theme.black} onClick={calendarSettingHandler}>
          {subsStartDate ? `${subsStartDate}배송` : '설정하기'}
        </Button>
      </DateSetting>
      <BottomButton disabled={subsStartDate ? false : true} onClick={goToRegisterCheck}>
        <TextH5B>다음</TextH5B>
      </BottomButton>
    </Container>
  );
};
const Container = styled.div``;

const DeliveryMethodAndPickupLocation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 24px;
  cursor: pointer;
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
`;
const Right = styled.div`
  align-self: center;
`;

const PeriodBox = styled.div`
  padding: 24px;
`;
const RadioWrapper = styled.ul`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 24px;
`;
const RadioLi = styled.li`
  display: flex;
  flex: 1 1 40%;
  align-items: center;
  padding-bottom: 16px;
  &:last-of-type {
    padding-bottom: 0;
  }
  .fBold {
    font-weight: bold;
  }
`;
const SubsInfoBox = styled.div`
  padding: 16px;
  background-color: ${theme.greyScale3};
  border-radius: 8px;
  .textBox {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    > div {
      line-height: 1;
    }
  }
`;

const DateSetting = styled.div`
  padding: 24px;
`;

const BottomButton = styled.button`
  ${fixedBottom}
  cursor: pointer;
  background-color: ${theme.black};
  color: #fff;
  &:disabled {
    background-color: ${theme.greyScale6};
    color: ${theme.greyScale25};
  }
`;
export default SubsSetInfoPage;
