import { useEffect, useState } from 'react';
import { SubsCalendarSheet } from '@components/BottomSheet/CalendarSheet';
import BorderLine from '@components/Shared/BorderLine';
import { Button, RadioButton } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { SUBSCRIPTION_PERIOD } from '@constants/subscription';
import { ISubsActiveDate, Obj } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { destinationForm, INIT_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_SUBS_INFO_STATE, subscriptionForm } from '@store/subscription';
import { userForm } from '@store/user';
import { fixedBottom, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import axios from 'axios';
import router from 'next/router';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMainDestinationsApi } from '@api/destination';
import { SubsDeliveryTypeAndLocation } from '@components/Pages/Subscription';
import { getOrderListsApi } from '@api/order';

// TODO(young) : 구독하기 메뉴 상세에서 들어온 구독 타입에 따라 설정해줘야함

export interface IDestinationAddress {
  delivery: string | undefined;
  address: string | undefined;
}

const SubsSetInfoPage = () => {
  const dispatch = useDispatch();
  const { subsStartDate, subsInfo } = useSelector(subscriptionForm);
  const { isLoginSuccess } = useSelector(userForm);
  const { userDestination, userTempDestination } = useSelector(destinationForm);
  const [subsDeliveryType, setSubsDeliveryType] = useState<string | undefined | string[]>(
    router.query?.subsDeliveryType
  );
  const [userSelectPeriod, setUserSelectPeriod] = useState(subsInfo?.period ? subsInfo.period : 'UNLIMITED');
  const [spotMainDestination, setSpotMainDestination] = useState<string | undefined>();
  const [mainDestinationAddress, setMainDestinationAddress] = useState<IDestinationAddress | undefined>();

  const mapper: Obj = {
    MORNING: '새벽배송',
    PARCEL: '택배배송',
  };

  useEffect(() => {
    if (subsDeliveryType) {
      getSpotMainDestination();
      getRecentOrderDestination();
    }
  }, []);

  const getSpotMainDestination = async () => {
    try {
      if (subsDeliveryType === 'SPOT') {
        if (userDestination?.delivery === 'SPOT') {
          setSpotMainDestination(userDestination.name);
        } else {
          const { data } = await getMainDestinationsApi({
            delivery: 'SPOT',
          });

          if (data.data) {
            const pickUpTime = `${data.data.spotPickup?.spot.lunchDeliveryStartTime}-${data.data.spotPickup?.spot.lunchDeliveryEndTime} / ${data.data.spotPickup?.spot.dinnerDeliveryStartTime}-${data.data.spotPickup?.spot.dinnerDeliveryEndTime}`;

            const destinationInfo = {
              id: data.data.id,
              name: data.data.name,
              location: data.data.location,
              main: false,
              availableTime: pickUpTime,
              spaceType: data.data.spaceType,
              spotPickupId: data.data.spotPickup?.id,
              closedDate: data.data.spotPickup?.spot.closedDate,
              delivery: 'spot',
            };
            dispatch(SET_DESTINATION(destinationInfo));
            dispatch(INIT_TEMP_DESTINATION());
            setSpotMainDestination(data.data.name);
          } else {
            setSpotMainDestination('픽업장소를 설정해 주세요');
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getRecentOrderDestination = async () => {
    const params = {
      days: 90,
      page: 1,
      size: 100,
      type: 'GENERAL',
    };
    try {
      if (['PARCEL', 'MORNING'].includes(subsDeliveryType! as string)) {
        if (['PARCEL', 'MORNING'].includes(userDestination?.delivery! as string)) {
          setSubsDeliveryType(userDestination?.delivery!);
          setMainDestinationAddress({
            delivery: mapper[userDestination?.delivery!],
            address: userDestination?.location?.address,
          });
        } else {
          const res = await getOrderListsApi(params);
          const filterData = res.data.data.orderDeliveries.filter((item) =>
            ['PARCEL', 'MORNING'].includes(item.delivery)
          );
          if (filterData) {
            setSubsDeliveryType(filterData[0].delivery);
            setMainDestinationAddress({
              delivery: mapper[filterData[0].delivery],
              address: filterData[0].location.address,
            });
          } else {
            setMainDestinationAddress({ delivery: '배송방법', address: '배송지를 설정해 주세요' });
          }
        }
      }
    } catch (err) {
      setMainDestinationAddress({ delivery: '배송방법', address: '배송지를 설정해 주세요' });
    }
  };

  const changeRadioHanler = async (value: string) => {
    setUserSelectPeriod(value);
  };

  const calendarSettingHandler = () => {
    if (userDestination) {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <SubsCalendarSheet userSelectPeriod={userSelectPeriod} />,
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
    dispatch(SET_SUBS_INFO_STATE({ period: userSelectPeriod }));
  };

  const goToDeliveryInfo = () => {
    router.push({
      pathname: '/cart/delivery-info',
      query: {
        subsDeliveryType: subsDeliveryType,
        isSubscription: true,
      },
    });
  };

  // TODO : 비로그인시 온보딩 화면으로 리다이렉트
  return (
    <Container>
      <SubsDeliveryTypeAndLocation
        goToDeliveryInfo={goToDeliveryInfo}
        subsDeliveryType={subsDeliveryType!}
        spotMainDestination={spotMainDestination}
        mainDestinationAddress={mainDestinationAddress}
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

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}
export default SubsSetInfoPage;
