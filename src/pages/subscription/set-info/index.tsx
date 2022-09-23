/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { SubsCalendarSheet } from '@components/BottomSheet/CalendarSheet';
import BorderLine from '@components/Shared/BorderLine';
import { Button, RadioButton } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { SUBSCRIPTION_PERIOD } from '@constants/subscription';
import { IRegisterDestinationRequest, Obj } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { destinationForm, INIT_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import {
  SET_SUBS_DELIVERY_EXPECTED_DATE,
  SET_SUBS_INFO_STATE,
  SET_SUBS_START_DATE,
  subscriptionForm,
} from '@store/subscription';
import { fixedBottom, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMainDestinationsApi, postDestinationApi } from '@api/destination';
import { SubsDeliveryTypeAndLocation } from '@components/Pages/Subscription';
import { getOrderDetailApi, getOrdersApi } from '@api/order';
import { getMenuDetailApi } from '@api/menu';
import { last } from 'lodash-es';
import { hide, show } from '@store/loading';

// TODO(young) : 구독하기 메뉴 상세에서 들어온 구독 타입에 따라 설정해줘야함

export interface IDestinationAddress {
  delivery: string | undefined;
  address: string | undefined;
}

const SubsSetInfoPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { subsStartDate, subsInfo, subsDeliveryExpectedDate } = useSelector(subscriptionForm);
  const { userDestination } = useSelector(destinationForm);
  const [subsDeliveryType, setSubsDeliveryType] = useState<string | string[]>();
  const [menuId, setMenuId] = useState<number>();
  const [userSelectPeriod, setUserSelectPeriod] = useState(subsInfo?.period && subsInfo.period);
  const [spotMainDestination, setSpotMainDestination] = useState<string | undefined>();
  const [mainDestinationAddress, setMainDestinationAddress] = useState<IDestinationAddress | undefined>();

  const mapper: Obj = {
    MORNING: '새벽배송',
    PARCEL: '택배배송',
  };

  useEffect(() => {
    if (router.isReady) {
      if (!router.query.menuId || !router.query.subsDeliveryType) {
        router.push('/subscription');
      }
      // setSubsDeliveryType('PARCEL');
      setSubsDeliveryType(router.query?.subsDeliveryType);
      setMenuId(Number(router.query?.menuId));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (subsDeliveryType) {
      getSpotMainDestination();
      getRecentOrderDestination();
    }
  }, [subsDeliveryType]);

  const {
    data: menuDetail,
    error: menuError,
    isLoading,
  } = useQuery(
    'getMenuDetail',
    async () => {
      dispatch(show());
      const { data } = await getMenuDetailApi(menuId!);

      return data?.data;
    },
    {
      onSettled: () => {
        dispatch(hide());
      },
      onSuccess: (data) => {
        !subsInfo?.period &&
          setUserSelectPeriod(
            last(SUBSCRIPTION_PERIOD.filter((item) => data?.subscriptionPeriods.includes(item.period)))?.period!
          );
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  const getSpotMainDestination = async () => {
    try {
      if (subsDeliveryType === 'SPOT') {
        if ((userDestination?.delivery === 'spot' || userDestination?.delivery === 'SPOT') && userDestination) {
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
            setSpotMainDestination(data.data.location?.address);
          } else {
            setSpotMainDestination('픽업장소를 설정해 주세요');
          }
        }
      }
    } catch (err) {
      console.log(err);
      setSpotMainDestination('픽업장소를 설정해 주세요');
    }
  };

  // 새벽/택배 최근주문리스트가 있을때 배송지 검색
  const { mutate: postDestination } = useMutation(
    async (reqBody: IRegisterDestinationRequest) => {
      const { data } = await postDestinationApi(reqBody);
      return data.data;
    },
    {
      onSuccess: async (data) => {
        dispatch(
          SET_DESTINATION({
            name: data?.name,
            location: {
              addressDetail: data?.location.addressDetail,
              address: data?.location.address,
              dong: data?.location.dong,
              zipCode: data?.location.zipCode,
            },
            main: data?.main,
            deliveryMessage: data?.deliveryMessage,
            receiverName: data?.receiverName,
            receiverTel: data?.receiverTel,
            deliveryMessageType: '',
            delivery: data?.delivery,
            id: data?.id,
          })
        );
      },
      onError: (data) => {
        console.log('error');
      },
    }
  );

  const getRecentOrderDestination = async () => {
    const params = {
      days: 90,
      page: 1,
      size: 100,
      type: 'SUBSCRIPTION',
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
          // const res = await getOrderListsApi(params);
          const res = await getOrdersApi(params);
          const filterData = await res.data.data.orders.filter((item: any) =>
            ['PARCEL', 'MORNING'].includes(item.delivery)
          );
          const res2 = await getOrderDetailApi(filterData[0].id);
          const destination = res2.data.data.orderDeliveries[0];

          if (filterData) {
            const reqBody = {
              name: destination?.location?.addressDetail!,
              delivery: destination.delivery.toUpperCase(),
              deliveryMessage: destination.deliveryMessage ?? '',
              main: destination.type === 'MAIN' ? true : false,
              receiverName: destination.receiverName ?? '',
              receiverTel: destination.receiverTel ?? '',
              location: {
                addressDetail: destination?.location?.addressDetail!,
                address: destination?.location?.address!,
                zipCode: destination?.location?.zipCode!,
                dong: destination?.location?.dong!,
              },
            };
            postDestination(reqBody);
            setSubsDeliveryType(destination.delivery);
            setMainDestinationAddress({
              delivery: mapper[destination.delivery],
              address: destination.location.address,
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
    // 구독기간 변경시 : store에 구독기간 저장 / 구독시작일,구독기간 초기화
    setUserSelectPeriod(value);
    dispatch(
      SET_SUBS_INFO_STATE({
        period: value,
        startDate: null,
        deliveryDay: null,
        deliveryTime: null,
      })
    );
    dispatch(
      SET_SUBS_START_DATE({
        subsStartDate: null,
      })
    );
    dispatch(
      SET_SUBS_DELIVERY_EXPECTED_DATE({
        subsDeliveryExpectedDate: null,
      })
    );
  };

  const calendarSettingHandler = () => {
    if (userDestination) {
      dispatch(
        SET_BOTTOM_SHEET({
          content: (
            <SubsCalendarSheet
              userSelectPeriod={userSelectPeriod!}
              subsDeliveryType={subsDeliveryType}
              menuId={menuId!}
            />
          ),
        })
      );
    } else {
      if (subsDeliveryType === 'SPOT') {
        dispatch(
          SET_ALERT({
            alertMessage: '픽업장소를 설정해주세요.',
            submitBtnText: '확인',
          })
        );
      } else {
        dispatch(
          SET_ALERT({
            alertMessage: '배송방법을 설정해주세요.',
            submitBtnText: '확인',
          })
        );
      }
    }
  };

  const goToRegisterCheck = () => {
    router.push('/subscription/register');

    dispatch(
      SET_SUBS_INFO_STATE({
        period: userSelectPeriod,
        deliveryType: subsDeliveryType,
        menuId: menuId,
        menuDetails: menuDetail?.menuDetails,
        menuImage: menuDetail?.thumbnail[0].url,
        datePeriod: [
          subsDeliveryExpectedDate[0].deliveryDate,
          subsDeliveryExpectedDate[subsDeliveryExpectedDate.length - 1].deliveryDate,
        ],
        subscriptionDiscountRates: menuDetail?.subscriptionDiscountRates,
      })
    );
  };

  const goToDeliveryInfo = () => {
    if (subsDeliveryType !== 'SPOT' && mainDestinationAddress && subsStartDate) {
      dispatch(
        SET_ALERT({
          alertMessage: '배송방법을 변경하면\n구독 시작/배송일이 초기화 됩니다.',
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {
            router.push({
              pathname: '/cart/delivery-info',
              query: {
                subsDeliveryType: subsDeliveryType,
                menuId: menuId,
                isSubscription: true,
                selected: userDestination ? 'Y' : 'N',
              },
            });
          },
        })
      );
    } else {
      router.push({
        pathname: '/cart/delivery-info',
        query: {
          subsDeliveryType: subsDeliveryType,
          menuId: menuId,
          isSubscription: true,
          selected: userDestination ? 'Y' : 'N',
        },
      });
    }
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
          {SUBSCRIPTION_PERIOD.map((item, index) => {
            const isSelected = userSelectPeriod === item.period;

            const disabled = menuDetail?.subscriptionPeriods.includes(item.period);
            return (
              <RadioLi
                key={item.id}
                onClick={() => {
                  disabled ? changeRadioHanler(item.period) : null;
                }}
              >
                <RadioButton isSelected={disabled ? isSelected : false} />
                <TextB2R className={`${isSelected && 'fBold'} ${!disabled && 'disabled'}`} padding="0 0 0 8px" pointer>
                  {index === 4 ? (
                    <>
                      {item.text} (최대 {last(menuDetail?.subscriptionDiscountRates)}% 할인)
                    </>
                  ) : (
                    <>
                      {item.text} ({menuDetail?.subscriptionDiscountRates![index]}% 할인)
                    </>
                  )}
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
            (1개월 {menuDetail?.subscriptionDiscountRates![4]}% / 2개월 {menuDetail?.subscriptionDiscountRates![5]}% /
            3개월 {menuDetail?.subscriptionDiscountRates![6]}% / 4개월 {menuDetail?.subscriptionDiscountRates![7]}%)
          </TextB3R>
        </SubsInfoBox>
      </PeriodBox>

      <BorderLine height={8} />

      <DateSetting>
        <TextH4B padding="0 0 24px">구독 시작/배송일</TextH4B>
        <Button border backgroundColor="#fff" color={theme.black} onClick={calendarSettingHandler}>
          {subsStartDate ? `${subsDeliveryType === 'SPOT' ? subsStartDate + '배송' : subsStartDate}` : '설정하기'}
        </Button>
      </DateSetting>
      <BottomButton disabled={subsStartDate ? false : true} onClick={goToRegisterCheck}>
        <TextH5B color={subsStartDate ? '#fff' : `${theme.greyScale25}`}>다음</TextH5B>
      </BottomButton>
    </Container>
  );
};
const Container = styled.div`
  padding-bottom: 56px;
`;

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
  .disabled {
    color: #dedede;
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
