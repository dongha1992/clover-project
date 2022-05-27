import { SubsMenuSheet } from '@components/BottomSheet/SubsSheet';
import { Button } from '@components/Shared/Button';
import { TextB1R, TextB2R, TextH4B, TextH5B } from '@components/Shared/Text';
import { IMenuTable } from '@model/index';
import { ReceiptBox, ReceiptLi, ReceiptUl } from '@pages/subscription/register';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { subscriptionForm } from '@store/subscription';
import { FlexBetween, theme } from '@styles/theme';
import { getFormatDate } from '@utils/common';
import { getFormatPrice } from '@utils/common';
import { cloneDeep } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import RequiredOptionListBox from './RequiredOptionListBox';
import SelectOptionListBox from './SelectOptionListBox';

interface IProps {
  selectCount: number | undefined;
  selectDate: Date | undefined;
  disposable: boolean;
}

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

const SelectDateInfoBox = ({ selectCount, selectDate, disposable }: IProps) => {
  const dispatch = useDispatch();
  const { subsCalendarSelectMenu, subsOrderMenus } = useSelector(subscriptionForm);
  const [receiptInfo, setReceiptInfo] = useState<IReceipt | null>();

  useEffect(() => {
    const data = {
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
    subsCalendarSelectMenu?.menuTableItems
      .filter((item) => item.selected === true)
      .map((item) => {
        if (item.main) {
          data.menuPrice = data.menuPrice + item.menuPrice;
          data.menuDiscount = data.menuDiscount + item.menuDiscount;
          data.eventDiscount = data.eventDiscount + item.eventDiscount;
        } else {
          data.menuPrice = data.menuPrice + item.menuPrice * item.count!;
          data.menuDiscount = data.menuDiscount + item.menuDiscount * item.count!;
          data.eventDiscount = data.eventDiscount + item.eventDiscount * item.count!;
        }

        item.menuOptions.map((option) => {
          if (option.name === '물티슈') {
            data.menuOption1.price = data.menuOption1.price + option.price;
            data.menuOption1.quantity = data.menuOption1.quantity + option.quantity;
          } else if (option.name === '수저') {
            data.menuOption2.price = data.menuOption2.price + option.price;
            data.menuOption2.quantity = data.menuOption2.quantity + option.quantity;
          }
        });
      });
    data.deliveryPrice =
      data.menuPrice + data.menuOption1.price + data.menuOption2.price - data.menuDiscount - data.eventDiscount > 35000
        ? 0
        : 3500;
    setReceiptInfo(data);
  }, [subsCalendarSelectMenu?.menuTableItems, subsOrderMenus]);

  const selectOptionAddHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SubsMenuSheet type="select" buttonType="select" />,
      })
    );
  };
  return (
    <Container>
      <OptionBox>
        <DeliveryInfoBox>
          <TextB1R padding="0 0 8px">
            <b>배송 {selectCount}회차</b> - {getFormatDate(selectDate)}
          </TextB1R>
          <TextB2R color={theme.greyScale65}>상품이 품절되면 대체상품이 발송됩니다.</TextB2R>
        </DeliveryInfoBox>
        <TextH5B>필수옵션</TextH5B>
        {subsCalendarSelectMenu && <RequiredOptionListBox list={subsCalendarSelectMenu?.menuTableItems} />}
        <TextH5B>선택옵션</TextH5B>
        {subsCalendarSelectMenu && <SelectOptionListBox list={subsCalendarSelectMenu?.menuTableItems} />}
        <Button
          margin="16px 0 0 0"
          backgroundColor="transparent"
          color={theme.black}
          border
          onClick={selectOptionAddHandler}
        >
          + 선택옵션 추가하기
        </Button>
      </OptionBox>

      {receiptInfo && (
        <ReceiptBox>
          <ReceiptUl>
            <ReceiptLi>
              <TextB2R>상품금액</TextB2R>
              <TextB2R>{getFormatPrice(String(receiptInfo.menuPrice))}원</TextB2R>
            </ReceiptLi>
            <ReceiptLi>
              <TextB2R>구독 할인</TextB2R>
              <TextB2R>
                {receiptInfo.menuDiscount ? `-${getFormatPrice(String(receiptInfo.menuDiscount))}` : 0}원
              </TextB2R>
            </ReceiptLi>
            <ReceiptLi>
              <TextB2R>스팟 이벤트 할인</TextB2R>
              <TextB2R>
                {receiptInfo.eventDiscount ? `-${getFormatPrice(String(receiptInfo.eventDiscount))}` : 0}원
              </TextB2R>
            </ReceiptLi>
            {disposable && (
              <>
                <ReceiptLi>
                  <TextB2R>물티슈</TextB2R>
                  <TextB2R>
                    {receiptInfo.menuOption1.quantity}개 / {getFormatPrice(String(receiptInfo.menuOption1.price))}원
                  </TextB2R>
                </ReceiptLi>
                <ReceiptLi>
                  <TextB2R>수저</TextB2R>
                  <TextB2R>
                    {receiptInfo.menuOption2.quantity}개 / {getFormatPrice(String(receiptInfo.menuOption2.price))}원
                  </TextB2R>
                </ReceiptLi>
              </>
            )}
            <ReceiptLi>
              <TextB2R>배송비</TextB2R>
              <TextB2R>{receiptInfo.deliveryPrice === 0 ? '무료배송' : '3,500'}</TextB2R>
            </ReceiptLi>
          </ReceiptUl>
          <FlexBetween padding="16px 0 0" className="btB">
            <TextH4B>배송 상품 금액</TextH4B>
            <TextH4B>
              {disposable
                ? getFormatPrice(
                    String(
                      receiptInfo.menuPrice +
                        receiptInfo.menuOption1.price +
                        receiptInfo.menuOption2.price +
                        receiptInfo.deliveryPrice -
                        receiptInfo.menuDiscount -
                        receiptInfo.eventDiscount
                    )
                  )
                : getFormatPrice(
                    String(
                      receiptInfo.menuPrice +
                        receiptInfo.deliveryPrice -
                        receiptInfo.menuDiscount -
                        receiptInfo.eventDiscount
                    )
                  )}
              원
            </TextH4B>
          </FlexBetween>
        </ReceiptBox>
      )}
    </Container>
  );
};
const Container = styled.div``;
const OptionBox = styled.article`
  padding: 24px;
`;

const DeliveryInfoBox = styled.div`
  padding-bottom: 24px;
  > div {
    b {
      font-weight: bold;
    }
  }
`;
export default SelectDateInfoBox;
