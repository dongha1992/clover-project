import SubsCalendar from '@components/Calendar/subscription/SubsCalendar';
import BorderLine from '@components/Shared/BorderLine';
import { TextB2R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { fixedBottom, FlexBetween, FlexRow, theme } from '@styles/theme';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Checkbox from '@components/Shared/Checkbox';
import SlideToggle from '@components/Shared/SlideToggle';
import { useRouter } from 'next/router';
import { SET_ORDER } from '@store/order';
import { SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import SelectDateInfoBox from '@components/Pages/Subscription/register/SelectDateInfoBox';
import { getFormatPrice } from '@utils/common';
import { destinationForm } from '@store/destination';
import { periodMapper } from '@constants/subscription';
import { DELIVERY_TIME_MAP2, DELIVERY_TYPE_MAP } from '@constants/order';
import MenusPriceBox from '@components/Pages/Subscription/payment/MenusPriceBox';

interface IReceipt {
  menuPrice: number;
  menuDiscount: number;
  eventDiscount: number;
  menuOption1: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  menuOption2: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  deliveryPrice: number;
}
const SubsRegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { subsOrderMenus, subsDeliveryExpectedDate, subsInfo } = useSelector(subscriptionForm);
  const { userDestination } = useSelector(destinationForm);
  const [toggleState, setToggleState] = useState(false);
  const [disposable, setDisposable] = useState(true);
  const [selectDate, setSelectDate] = useState<Date | undefined>(
    subsDeliveryExpectedDate && subsDeliveryExpectedDate[0]?.deliveryDate
  );
  const [selectCount, setSelectCount] = useState();
  const [allMenuPriceInfo, setAllMenuPriceInfo] = useState<IReceipt | null>();
  const [subsMonth, setSubsMonth] = useState<unknown[]>();
  const [orderDeliveries, setOrderDeliveries] = useState();

  useEffect(() => {
    if (!subsDeliveryExpectedDate && !subsOrderMenus && !subsInfo) {
      router.push('/subscription');
    }
  }, []);

  useEffect(() => {
    let monthObj = new Set();
    subsDeliveryExpectedDate?.forEach((elem: any) => {
      monthObj.add(dayjs(elem.deliveryDate).format('M'));
    });
    setSubsMonth(Array.from(monthObj));
  }, []);

  useEffect(() => {
    setSelectCount(
      subsDeliveryExpectedDate?.findIndex((x: any) => x.deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) + 1
    );
  }, [selectDate]);

  useEffect(() => {
    const all = {
      menuPrice: 0,
      menuDiscount: 0,
      eventDiscount: 0,
      menuOption1: {
        id: 1,
        name: '',
        price: 0,
        quantity: 0,
      },
      menuOption2: {
        id: 2,
        name: '',
        price: 0,
        quantity: 0,
      },
      deliveryPrice: 0,
    };
    let orderDeliveries: any = [];

    subsOrderMenus?.map((data) => {
      data.deliveryDate;
      let menus: any = [];
      let options: any = [];
      let subsDayPrice = 0;

      data.menuTableItems
        .filter((item: any) => item.selected === true)
        .forEach((item: any) => {
          menus.push({
            menuDetailId: item.menuDetailId,
            menuQuantity: 1,
          });
          // 배송비 계산을 위한 변수
          subsDayPrice = subsDayPrice + (item.menuPrice - item.menuDiscount - item.eventDiscount);

          all.menuPrice = all.menuPrice + item.menuPrice;
          all.menuDiscount = all.menuDiscount + item.menuDiscount;
          all.eventDiscount = all.eventDiscount + item.eventDiscount;

          item.menuOptions.forEach((option: any) => {
            if (option.id === 1) {
              if (all.menuOption1.name === '') all.menuOption1.name = option.name;

              if (disposable) {
                options[0]
                  ? (options[0].optionQuantity = options[0].optionQuantity + option.quantity)
                  : (options[0] = {
                      optionId: 1,
                      optionQuantity: option.quantity,
                    });
                subsDayPrice = subsDayPrice + option.price;
              }
              all.menuOption1.price = all.menuOption1.price + option.price;
              all.menuOption1.quantity = all.menuOption1.quantity + option.quantity;
            } else if (option.id === 2) {
              if (all.menuOption2.name === '') all.menuOption2.name = option.name;

              if (disposable) {
                options[1]
                  ? (options[1].optionQuantity = options[1].optionQuantity + option.quantity)
                  : (options[1] = {
                      optionId: 2,
                      optionQuantity: option.quantity,
                    });
                subsDayPrice = subsDayPrice + option.price;
              }
              all.menuOption2.price = all.menuOption2.price + option.price;
              all.menuOption2.quantity = all.menuOption2.quantity + option.quantity;
            }
          });
        });

      subsDayPrice > 35000
        ? (all.deliveryPrice = all.deliveryPrice + 0)
        : (all.deliveryPrice = all.deliveryPrice + 3500);

      orderDeliveries.push({
        deliveryDate: data.deliveryDate,
        orderMenus: menus,
        orderOptions: options,
      });
    });

    setOrderDeliveries(orderDeliveries);
    setAllMenuPriceInfo(all);
  }, [subsOrderMenus, disposable]);

  const clickEvent = () => {
    setToggleState((prev) => !prev);
  };

  const onSubscribe = () => {
    const reqBody: any = {
      delivery: subsInfo?.deliveryType!,
      deliveryDetail: subsInfo?.deliveryType === 'SPOT' ? DELIVERY_TIME_MAP2[subsInfo?.deliveryTime!] : null,
      destinationId: userDestination?.id,
      isSubOrderDelivery: false,
      orderDeliveries: orderDeliveries,
      subscriptionMenuDetailId: subsInfo?.menuDetails![0].id,
      subscriptionRound: 1,
      subscriptionPeriod: subsInfo?.period,
      type: 'SUBSCRIPTION',
    };

    dispatch(SET_ORDER(reqBody));
    router.push({ pathname: '/order', query: { isSubscription: true } });
  };

  const goToEntireDiet = () => {
    router.push('/subscription/register/diet-info');
  };

  return (
    <Container>
      {subsDeliveryExpectedDate && (
        <>
          <InfoBox>
            <FlexBetween className="box" onClick={clickEvent}>
              <TextH4B>구독정보</TextH4B>
              <div className="wrap">
                {!toggleState && (
                  <TextB2R className="infoText">
                    {DELIVERY_TYPE_MAP[subsInfo?.deliveryType!]} - {subsInfo?.deliveryTime} /{' '}
                    {userDestination?.location?.address} {userDestination?.location?.addressDetail}
                  </TextB2R>
                )}
                <div className={`svgBox ${toggleState ? 'down' : ''}`}>
                  <SVGIcon name="triangleDown" />
                </div>
              </div>
            </FlexBetween>
            <SlideInfoBox>
              <SlideToggle state={toggleState} duration={0.5}>
                <ul>
                  <li>
                    <TextH5B>배송방법</TextH5B>
                    <TextB2R>
                      {DELIVERY_TYPE_MAP[subsInfo?.deliveryType!]} - {subsInfo?.deliveryTime}
                    </TextB2R>
                  </li>
                  <li>
                    <TextH5B>픽업장소</TextH5B>
                    <TextB2R>
                      {userDestination?.location?.address} {userDestination?.location?.addressDetail}
                    </TextB2R>
                  </li>
                  <li>
                    <TextH5B>구독기간</TextH5B>
                    <TextB2R>{subsInfo && periodMapper[subsInfo.period!]}</TextB2R>
                  </li>
                  <li>
                    <TextH5B>구독 시작일</TextH5B>
                    <TextB2R>{subsInfo?.startDate}</TextB2R>
                  </li>
                  <li>
                    <TextH5B>배송주기</TextH5B>
                    <TextB2R>
                      주 {subsInfo?.deliveryDay?.length}회 / {subsInfo?.deliveryDay?.join('·')}
                    </TextB2R>
                  </li>
                </ul>
              </SlideToggle>
            </SlideInfoBox>
          </InfoBox>
          <BorderLine height={8} />

          <DietConfirmBox>
            <div className="wrap">
              <TextH4B>식단 확인</TextH4B>
              <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToEntireDiet}>
                전체 식단 보기
              </TextH6B>
            </div>
            <TextB2R color={theme.brandColor}>
              {subsInfo?.period === 'UNLIMITED' ? '5주간' : `${periodMapper[subsInfo?.period!]}간`}, 주{' '}
              {subsInfo?.deliveryDay?.length}회씩 ({subsInfo?.deliveryDay?.join('·')}) 총 {subsOrderMenus?.length}회
              배송되는 식단입니다.
            </TextB2R>
          </DietConfirmBox>
          <CalendarBox>
            {subsMonth && subsMonth?.length > 1 && (
              <TextH5B padding="10px 0" color="#fff" backgroundColor={theme.brandColor} center>
                {subsMonth[0]}월, {subsMonth[1]}월 식단을 모두 확인해 주세요!
              </TextH5B>
            )}

            <SubsCalendar
              subsActiveDates={subsDeliveryExpectedDate}
              deliveryExpectedDate={subsDeliveryExpectedDate}
              setSelectDate={setSelectDate}
              subsPeriod={subsInfo?.period!}
              menuChangeDate={subsOrderMenus}
            />
          </CalendarBox>

          <SelectDateInfoBox selectCount={selectCount} selectDate={selectDate} disposable={disposable} />

          <DisposableAddBox>
            <TextH4B className="title">일회용품 추가</TextH4B>
            <TextB2R className="content">샐러드·도시락 상품의 수량만큼 일회용품을 추가합니다.</TextB2R>
            <FlexRow>
              <Checkbox
                onChange={() => {
                  setDisposable((prev) => !prev);
                }}
                isSelected={disposable}
              />
              <TextB2R
                padding="0 0 0 8px"
                className="des"
                onClick={() => {
                  setDisposable((prev) => !prev);
                }}
                pointer
              >
                일회용품(100원) 총 {allMenuPriceInfo?.menuOption1.quantity! + allMenuPriceInfo?.menuOption2.quantity!}개
                - 환경부담금{' '}
                <b>
                  {getFormatPrice(String(allMenuPriceInfo?.menuOption1.price! + allMenuPriceInfo?.menuOption2.price!))}
                  원
                </b>
              </TextB2R>
            </FlexRow>
          </DisposableAddBox>
          {allMenuPriceInfo && (
            <MenusPriceBox
              disposable={disposable}
              menuPrice={allMenuPriceInfo.menuPrice}
              menuDiscount={allMenuPriceInfo.menuDiscount}
              eventDiscount={allMenuPriceInfo.eventDiscount}
              menuOption1={allMenuPriceInfo.menuOption1}
              menuOption2={allMenuPriceInfo.menuOption2}
              deliveryPrice={subsInfo?.deliveryType === 'SPOT' ? 0 : allMenuPriceInfo.deliveryPrice}
              deliveryLength={subsOrderMenus?.length!}
              deliveryType={subsInfo?.deliveryType!}
              subscriptionDiscountRates={subsInfo?.subscriptionDiscountRates!}
            />
          )}
          <BottomButton onClick={onSubscribe}>
            <TextH5B>구독하기</TextH5B>
          </BottomButton>
        </>
      )}
    </Container>
  );
};
const Container = styled.div``;
const InfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  position: relative;
  .box {
    cursor: pointer;
  }
  .wrap {
    display: flex;
    align-items: center;
    .infoText {
      width: 200px;
      height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .svgBox {
      svg {
        transition: all 0.5s;
        margin-bottom: 3px;
      }
      &.down {
        svg {
          transform: rotate(-180deg);
        }
      }
    }
  }
`;
const SlideInfoBox = styled.div`
  ul {
    padding-top: 24px;
    li {
      display: flex;
      justify-content: space-between;
      padding-bottom: 16px;
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
`;
const DietConfirmBox = styled.div`
  padding: 24px 24px 16px;
  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
  }
`;
const CalendarBox = styled.div``;

export const MenuUl = styled.ul``;
export const MenuLi = styled.li`
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  position: relative;
  &:last-of-type {
    border-bottom: none;
  }
  button.changeBtn {
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: -19px;
    padding: 10px 16px;
    border: 1px solid #242424;
    border-radius: 8px;
  }
  button.deleteBtn {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 16px;
    padding: 0;
  }
`;
export const MenuImgBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
`;
export const MenuTextBox = styled.div`
  padding-left: 8px;
  flex: 1;
  .wrap {
    display: flex;
    align-items: center;
    position: relative;
    .line {
      margin: 0 8px;
      width: 1px;
      height: 16px;
      background-color: ${theme.greyScale6};
    }
  }
  button:disabled {
    border: 1px solid #f2f2f2;
    color: #c8c8c8;
  }
  .change {
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: -0.4px;
    color: #35ad73;
    margin-left: 4px;
  }
`;

const DisposableAddBox = styled.div`
  padding: 28px 24px;
  .title {
    padding-bottom: 8px;
  }
  .content {
    color: ${theme.greyScale65};
    padding-bottom: 16px;
  }
  .des {
    b {
      font-weight: bold;
    }
  }
`;
const Badge = styled.div`
  padding: 4px 8px;
  margin-right: 4px;
  background-color: ${theme.brandColor5P};
  color: ${theme.brandColor};
`;

const BottomButton = styled.button`
  ${fixedBottom}
  cursor: pointer;
  background-color: ${theme.black};
  color: #fff;
`;

export default SubsRegisterPage;
