import { SubsMenuSheet } from '@components/BottomSheet/SubsSheet';
import { Button } from '@components/Shared/Button';
import { TextB1R, TextB2R, TextH5B } from '@components/Shared/Text';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { subscriptionForm } from '@store/subscription';
import { theme } from '@styles/theme';
import { getFormatDate } from '@utils/common';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import MenuPriceBox from '../payment/MenuPriceBox';
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

const SelectDateInfoBox = ({ selectCount, selectDate, disposable }: IProps) => {
  const dispatch = useDispatch();
  const { subsCalendarSelectMenu, subsOrderMenus, subsInfo } = useSelector(subscriptionForm);
  const [receiptInfo, setReceiptInfo] = useState<IReceipt | null>();

  useEffect(() => {
    const data = {
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
    subsCalendarSelectMenu?.menuTableItems
      .filter((item) => item.selected === true)
      .forEach((item) => {
        if (item.main) {
          data.menuPrice = data.menuPrice + item.menuPrice;
          data.menuDiscount = data.menuDiscount + item.menuDiscount;
          data.eventDiscount = data.eventDiscount + item.eventDiscount;
        } else {
          data.menuPrice = data.menuPrice + item.menuPrice * item.count!;
          data.menuDiscount = data.menuDiscount + item.menuDiscount * item.count!;
          data.eventDiscount = data.eventDiscount + item.eventDiscount * item.count!;
        }

        item.menuOptions.forEach((option) => {
          if (option.id === 1) {
            if (data.menuOption1.name === '') data.menuOption1.name = option.name;

            data.menuOption1.price = data.menuOption1.price + option.price;
            data.menuOption1.quantity = data.menuOption1.quantity + option.quantity;
          } else if (option.id === 2) {
            if (data.menuOption2.name === '') data.menuOption2.name = option.name;

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
        <MenuPriceBox
          disposable={disposable}
          menuPrice={receiptInfo.menuPrice}
          menuDiscount={receiptInfo.menuDiscount}
          eventDiscount={receiptInfo.eventDiscount}
          menuOption1={receiptInfo.menuOption1}
          menuOption2={receiptInfo.menuOption2}
          deliveryPrice={subsInfo?.deliveryType === 'SPOT' ? 0 : receiptInfo.deliveryPrice}
          deliveryType={subsInfo?.deliveryType!}
        />
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
