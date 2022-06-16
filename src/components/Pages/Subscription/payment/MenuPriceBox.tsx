import { TextB2R, TextH4B } from '@components/Shared/Text';
import { FlexBetween } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import { MenuPriceContainer, MenuPriceLi, MenuPriceUl, option } from './MenusPriceBox';

interface IProps {
  disposable?: boolean;
  menuPrice: number;
  menuDiscount: number;
  eventDiscount: number;
  menuOption1: option;
  menuOption2: option;
  deliveryPrice: number;
  deliveryType: string;
}

const MenuPriceBox = ({
  disposable,
  menuPrice,
  menuDiscount,
  eventDiscount,
  menuOption1,
  menuOption2,
  deliveryPrice,
  deliveryType,
}: IProps) => {
  return (
    <MenuPriceContainer>
      <MenuPriceUl>
        <MenuPriceLi>
          <TextB2R>상품금액</TextB2R>
          <TextB2R>{getFormatPrice(String(menuPrice))}원</TextB2R>
        </MenuPriceLi>
        {menuDiscount !== 0 && (
          <MenuPriceLi>
            <TextB2R>구독 할인</TextB2R>
            <TextB2R>{menuDiscount ? `-${getFormatPrice(String(menuDiscount))}` : 0}원</TextB2R>
          </MenuPriceLi>
        )}
        {deliveryType === 'SPOT' && eventDiscount !== 0 && (
          <MenuPriceLi>
            <TextB2R>스팟 이벤트 할인</TextB2R>
            <TextB2R>{eventDiscount ? `-${getFormatPrice(String(eventDiscount))}` : 0}원</TextB2R>
          </MenuPriceLi>
        )}
        {disposable && (
          <>
            {menuOption1.quantity !== 0 && (
              <MenuPriceLi>
                <TextB2R>{menuOption1.name}</TextB2R>
                <TextB2R>
                  {menuOption1.quantity}개 / {getFormatPrice(String(menuOption1.price))}원
                </TextB2R>
              </MenuPriceLi>
            )}
            {menuOption2.quantity !== 0 && (
              <MenuPriceLi>
                <TextB2R>{menuOption2.name}</TextB2R>
                <TextB2R>
                  {menuOption2.quantity}개 / {getFormatPrice(String(menuOption2.price))}원
                </TextB2R>
              </MenuPriceLi>
            )}
          </>
        )}
        <MenuPriceLi>
          <TextB2R>배송비</TextB2R>
          <TextB2R>{deliveryPrice === 0 ? '무료배송' : '3,500'}</TextB2R>
        </MenuPriceLi>
      </MenuPriceUl>
      <FlexBetween padding="16px 0 0" className="btB">
        <TextH4B>배송 상품 금액</TextH4B>
        <TextH4B>
          {disposable
            ? getFormatPrice(
                String(menuPrice + menuOption1.price + menuOption2.price + deliveryPrice - menuDiscount - eventDiscount)
              )
            : getFormatPrice(String(menuPrice + deliveryPrice - menuDiscount - eventDiscount))}
          원
        </TextH4B>
      </FlexBetween>
    </MenuPriceContainer>
  );
};
export default MenuPriceBox;
