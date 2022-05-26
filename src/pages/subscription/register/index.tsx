import SubsCalendar from '@components/Calendar/SubsCalendar';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { TextB1R, TextB2R, TextB3R, TextH4B, TextH5B, TextH6B, TextH7B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { fixedBottom, FlexBetween, FlexEnd, FlexRow, theme } from '@styles/theme';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Checkbox from '@components/Shared/Checkbox';
import SlideToggle from '@components/Shared/SlideToggle';
import router from 'next/router';
import { SET_ORDER } from '@store/order';
import { getFormatDate, SVGIcon } from '@utils/common';
import { wrapper } from '@store/index';
import { Obj } from '@model/index';
import dayjs from 'dayjs';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SubsMenuSheet } from '@components/BottomSheet/SubsSheet';
import SelectDateInfoBox from '@components/Pages/Subscription/register/SelectDateInfoBox';
import { getFormatPrice } from '@utils/common';
import { destinationForm } from '@store/destination';

interface IReceipt {
  menuPrice: number;
  menuDiscount: number;
  eventDiscount: number;
  menuOption1: {
    name: string;
    price: number;
    quantity: number;
  };
  menuOption2: {
    name: string;
    price: number;
    quantity: number;
  };
  deliveryPrice: number;
}
const SubsRegisterPage = () => {
  const dispatch = useDispatch();
  const { subsOrderMenus, subsDeliveryExpectedDate, subsInfo } = useSelector(subscriptionForm);
  const { userDestination } = useSelector(destinationForm);
  const [toggleState, setToggleState] = useState(false);
  const [disposable, setDisposable] = useState(false);
  const [selectDate, setSelectDate] = useState<Date | undefined>(subsDeliveryExpectedDate[0].deliveryDate);
  const [selectCount, setSelectCount] = useState();
  const [allMenuPriceInfo, setAllMenuPriceInfo] = useState<IReceipt | null>();
  const mapper: Obj = {
    ONE_WEEK: '1주',
    TWO_WEEK: '2주',
    THREE_WEEK: '3주',
    FOUR_WEEK: '4주',
    UNLIMITED: '정기구독',
  };

  useEffect(() => {
    if (!subsDeliveryExpectedDate) {
      router.push('/subscription/set-info');
    }
  }, []);

  useEffect(() => {
    setSelectCount(
      subsDeliveryExpectedDate.findIndex((x: any) => x.deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) + 1
    );
  }, [selectDate]);

  useEffect(() => {
    const all = {
      menuPrice: 0,
      menuDiscount: 0,
      eventDiscount: 0,
      menuOption1: {
        name: '물티슈',
        price: 0,
        quantity: 0,
      },
      menuOption2: {
        name: '수저',
        price: 0,
        quantity: 0,
      },
      deliveryPrice: 0,
    };
    subsOrderMenus?.map((data) => {
      data.menuTableItems
        .filter((item: any) => item.selected === true)
        .map((item: any) => {
          if (item.main) {
            all.menuPrice = all.menuPrice + item.menuPrice;
            all.menuDiscount = all.menuDiscount + item.menuDiscount;
            all.eventDiscount = all.eventDiscount + item.eventDiscount;
          } else {
            all.menuPrice = all.menuPrice + item.menuPrice * item.count;
            all.menuDiscount = all.menuDiscount + item.menuDiscount * item.count;
            all.eventDiscount = all.eventDiscount + item.eventDiscount * item.count;
          }

          item.menuOptions.map((option: any) => {
            if (option.name === '물티슈') {
              all.menuOption1.price = all.menuOption1.price + option.price;
              all.menuOption1.quantity = all.menuOption1.quantity + option.quantity;
            } else if (option.name === '수저') {
              all.menuOption2.price = all.menuOption2.price + option.price;
              all.menuOption2.quantity = all.menuOption2.quantity + option.quantity;
            }
          });

          all.menuPrice + all.menuOption1.price + all.menuOption2.price - all.menuDiscount - all.eventDiscount > 35000
            ? (all.deliveryPrice = all.deliveryPrice + 0)
            : (all.deliveryPrice = all.deliveryPrice + 3500);
        });
    });
    setAllMenuPriceInfo(all);
  }, [subsOrderMenus]);

  const clickEvent = () => {
    setToggleState((prev) => !prev);
  };

  const onSubscribe = () => {
    // TODO(young) : 임시
    const reqBody = {
      destinationId: 244,
      delivery: 'PARCEL',
      deliveryDetail: '',
      isSubOrderDelivery: false,
      orderDeliveries: [
        {
          deliveryDate: '2022-04-16',
          orderMenus: [
            {
              menuDetailId: 72,
              menuQuantity: 1,
            },
            {
              menuDetailId: 511,
              menuQuantity: 1,
            },
          ],
          orderOptions: [
            {
              optionId: 1,
              optionQuantity: 1,
            },
          ],
        },
      ],
      type: 'GENERAL',
    };

    dispatch(SET_ORDER(reqBody));
    router.push('/order');
  };

  const goToEntireDiet = () => {
    router.push('/subscription/register/entire-diet');
  };

  return (
    <Container>
      <InfoBox>
        <FlexBetween className="box" onClick={clickEvent}>
          <TextH4B>구독정보</TextH4B>
          <div className="wrap">
            <TextB2R className="infoText">
              스팟배송 - {subsInfo?.deliveryTime} / {userDestination?.location?.address}{' '}
              {userDestination?.location?.addressDetail}
            </TextB2R>
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
                <TextB2R>스팟배송 - {subsInfo?.deliveryTime}</TextB2R>
              </li>
              <li>
                <TextH5B>픽업장소</TextH5B>
                <TextB2R>
                  {userDestination?.location?.address} {userDestination?.location?.addressDetail}
                </TextB2R>
              </li>
              <li>
                <TextH5B>구독기간</TextH5B>
                <TextB2R>{subsInfo && mapper[subsInfo.period!]}</TextB2R>
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
          {subsInfo?.period === 'UNLIMITED' ? '5주간' : `${mapper[subsInfo?.period!]}간`}, 주{' '}
          {subsInfo?.deliveryDay?.length}회씩 ({subsInfo?.deliveryDay?.join('·')}) 총 {subsOrderMenus?.length}회
          배송되는 식단입니다.
        </TextB2R>
      </DietConfirmBox>
      <CalendarBox>
        <TextH5B padding="10px 0" color="#fff" backgroundColor={theme.brandColor} center>
          1월, 2월 식단을 모두 확인해 주세요!
        </TextH5B>
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
          <TextB2R padding="0 0 0 8px" className="des">
            일회용품(100원) 총 {allMenuPriceInfo?.menuOption1.quantity! + allMenuPriceInfo?.menuOption2.quantity!}개 -
            환경부담금{' '}
            <b>
              {getFormatPrice(String(allMenuPriceInfo?.menuOption1.price! + allMenuPriceInfo?.menuOption2.price!))}원
            </b>
          </TextB2R>
        </FlexRow>
      </DisposableAddBox>

      {allMenuPriceInfo && (
        <ReceiptBox>
          <FlexBetween padding="0 0 16px" margin="0 0 16px" className="bbN">
            <TextH5B>총 상품금액</TextH5B>
            <TextB2R>
              {disposable
                ? getFormatPrice(
                    String(
                      allMenuPriceInfo.menuPrice +
                        allMenuPriceInfo.menuOption1.price +
                        allMenuPriceInfo.menuOption2.price -
                        allMenuPriceInfo.menuDiscount -
                        allMenuPriceInfo.eventDiscount
                    )
                  )
                : getFormatPrice(
                    String(allMenuPriceInfo.menuPrice - allMenuPriceInfo.menuDiscount - allMenuPriceInfo.eventDiscount)
                  )}
              원
            </TextB2R>
          </FlexBetween>
          <ReceiptUl>
            <ReceiptLi>
              <TextB2R>총 할인금액</TextB2R>
              <TextB2R>
                -{getFormatPrice(String(allMenuPriceInfo.menuDiscount + allMenuPriceInfo.eventDiscount))}원
              </TextB2R>
            </ReceiptLi>
            <ReceiptLi>
              <FlexRow>
                <TextB2R>구독 할인</TextB2R>
                <SVGIcon name="questionMark" />
              </FlexRow>
              <TextB2R>
                {allMenuPriceInfo.menuDiscount ? `-${getFormatPrice(String(allMenuPriceInfo.menuDiscount))}` : 0}원
              </TextB2R>
            </ReceiptLi>
            <ReceiptLi>
              <TextB2R>스팟 이벤트 할인</TextB2R>
              <TextB2R>
                {allMenuPriceInfo.eventDiscount ? `-${getFormatPrice(String(allMenuPriceInfo.eventDiscount))}` : 0}원
              </TextB2R>
            </ReceiptLi>
          </ReceiptUl>
          <ReceiptUl>
            <ReceiptLi className="btB" padding="16px 0 0">
              <TextH5B>환경부담금 (일회용품)</TextH5B>
              <TextB2R>
                {disposable ? allMenuPriceInfo?.menuOption1.quantity! + allMenuPriceInfo?.menuOption2.quantity! : 0}개 /{' '}
                {disposable
                  ? getFormatPrice(String(allMenuPriceInfo?.menuOption1.price! + allMenuPriceInfo?.menuOption2.price!))
                  : 0}
                원
              </TextB2R>
            </ReceiptLi>
            {disposable && (
              <>
                <ReceiptLi>
                  <TextB2R>물티슈</TextB2R>
                  <TextB2R>
                    {disposable ? allMenuPriceInfo?.menuOption1.quantity : 0}개 /{' '}
                    {disposable ? getFormatPrice(String(allMenuPriceInfo?.menuOption1.price)) : 0}원
                  </TextB2R>
                </ReceiptLi>
                <ReceiptLi>
                  <TextB2R>수저</TextB2R>
                  <TextB2R>
                    {disposable ? allMenuPriceInfo?.menuOption2.quantity : 0}개 /{' '}
                    {disposable ? getFormatPrice(String(allMenuPriceInfo?.menuOption2.price)) : 0}원
                  </TextB2R>
                </ReceiptLi>
              </>
            )}
          </ReceiptUl>
          <FlexBetween padding="16px 0 0" margin="0 0 16px" className="btN">
            <TextH5B>배송비</TextH5B>
            <TextB2R>
              {subsOrderMenus?.length}회 /{' '}
              {allMenuPriceInfo.deliveryPrice === 0
                ? '무료배송'
                : `${getFormatPrice(String(allMenuPriceInfo.deliveryPrice))}원`}
            </TextB2R>
          </FlexBetween>
          <FlexBetween padding="16px 0 0" margin="0 0 8px" className="btB">
            <TextH4B>결제예정금액</TextH4B>
            <TextH4B>
              {disposable
                ? getFormatPrice(
                    String(
                      allMenuPriceInfo.menuPrice +
                        allMenuPriceInfo.menuOption1.price +
                        allMenuPriceInfo.menuOption2.price +
                        allMenuPriceInfo.deliveryPrice -
                        allMenuPriceInfo.menuDiscount -
                        allMenuPriceInfo.eventDiscount
                    )
                  )
                : getFormatPrice(
                    String(
                      allMenuPriceInfo.menuPrice +
                        allMenuPriceInfo.deliveryPrice -
                        allMenuPriceInfo.menuDiscount -
                        allMenuPriceInfo.eventDiscount
                    )
                  )}
              원
            </TextH4B>
          </FlexBetween>
          <FlexEnd>
            <Badge>
              <TextH7B>프코회원</TextH7B>
            </Badge>
            <TextB3R>
              구매 시 <b>nP (n%) 적립 예정</b>
            </TextB3R>
          </FlexEnd>
        </ReceiptBox>
      )}
      <BottomButton onClick={onSubscribe}>
        <TextH5B>구독하기</TextH5B>
      </BottomButton>
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
`;

export const ReceiptBox = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  .btB {
    border-top: 1px solid #242424;
  }
  .btN {
    border-top: 1px solid #ececec;
  }
  .bbN {
    border-bottom: 1px solid #ececec;
  }
`;
export const ReceiptUl = styled.ul`
  padding-bottom: 16px;
`;
export const ReceiptLi = styled.li<{ padding?: string }>`
  display: flex;
  justify-content: space-between;
  padding: ${(props) => props.padding && props.padding};
  padding-bottom: 8px;
  &:last-of-type {
    padding-bottom: 0;
  }
  svg {
    margin-bottom: 3px;
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
