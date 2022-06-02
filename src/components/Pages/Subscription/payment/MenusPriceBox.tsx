import { TextB2R, TextB3R, TextH4B, TextH5B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexEnd, FlexRow, theme } from '@styles/theme';
import { getFormatPrice, SVGIcon } from '@utils/common';
import styled from 'styled-components';

export interface option {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface IProps {
  disposable?: boolean;
  menuPrice: number;
  menuDiscount: number;
  eventDiscount: number;
  menuOption1: option;
  menuOption2: option;
  deliveryPrice: number;
  deliveryLength: number;
  point?: number;
}

const MenusPriceBox = ({
  disposable,
  menuPrice,
  menuDiscount,
  eventDiscount,
  menuOption1,
  menuOption2,
  deliveryPrice,
  deliveryLength,
  point,
}: IProps) => {
  return (
    <MenuPriceContainer>
      <FlexBetween padding="0 0 16px" margin="0 0 16px" className="bbN">
        <TextH5B>총 상품금액</TextH5B>
        <TextB2R>
          {disposable
            ? getFormatPrice(String(menuPrice + menuOption1?.price + menuOption2?.price - menuDiscount - eventDiscount))
            : getFormatPrice(String(menuPrice - menuDiscount - eventDiscount))}
          원
        </TextB2R>
      </FlexBetween>
      <MenuPriceUl>
        <MenuPriceLi>
          <TextB2R>총 할인금액</TextB2R>
          <TextB2R>-{getFormatPrice(String(menuDiscount + eventDiscount))}원</TextB2R>
        </MenuPriceLi>
        <MenuPriceLi>
          <FlexRow>
            <TextB2R>구독 할인</TextB2R>
            <SVGIcon name="questionMark" />
          </FlexRow>
          <TextB2R>{menuDiscount ? `-${getFormatPrice(String(menuDiscount))}` : 0}원</TextB2R>
        </MenuPriceLi>
        <MenuPriceLi>
          <TextB2R>스팟 이벤트 할인</TextB2R>
          <TextB2R>{eventDiscount ? `-${getFormatPrice(String(eventDiscount))}` : 0}원</TextB2R>
        </MenuPriceLi>
      </MenuPriceUl>
      <MenuPriceUl>
        <MenuPriceLi className="btB" padding="16px 0 0">
          <TextH5B>환경부담금 (일회용품)</TextH5B>
          <TextB2R>
            {disposable ? menuOption1?.quantity! + menuOption2?.quantity! : 0}개 /{' '}
            {disposable ? getFormatPrice(String(menuOption1?.price! + menuOption2?.price!)) : 0}원
          </TextB2R>
        </MenuPriceLi>
        {disposable && (
          <>
            {menuOption1?.quantity !== 0 && (
              <MenuPriceLi>
                <TextB2R>{menuOption1?.name}</TextB2R>
                <TextB2R>
                  {disposable ? menuOption1?.quantity : 0}개 /{' '}
                  {disposable ? getFormatPrice(String(menuOption1?.price)) : 0}원
                </TextB2R>
              </MenuPriceLi>
            )}
            {menuOption2?.quantity !== 0 && (
              <MenuPriceLi>
                <TextB2R>{menuOption2?.name}</TextB2R>
                <TextB2R>
                  {disposable ? menuOption2?.quantity : 0}개 /{' '}
                  {disposable ? getFormatPrice(String(menuOption2?.price)) : 0}원
                </TextB2R>
              </MenuPriceLi>
            )}
          </>
        )}
      </MenuPriceUl>
      <FlexBetween padding="16px 0 0" margin="0 0 16px" className="btN">
        <TextH5B>배송비</TextH5B>
        <TextB2R>
          {deliveryLength}회 / {deliveryPrice === 0 ? '무료배송' : `${getFormatPrice(String(deliveryPrice))}원`}
        </TextB2R>
      </FlexBetween>
      {!!point && (
        <FlexBetween padding="16px 0 0" margin="0 0 16px" className="btN">
          <TextH5B>포인트 사용</TextH5B>
          <TextB2R>{getFormatPrice(String(point))}원</TextB2R>
        </FlexBetween>
      )}
      <FlexBetween padding="16px 0 0" margin="0 0 8px" className="btB">
        <TextH4B>결제예정금액</TextH4B>
        <TextH4B>
          {disposable
            ? getFormatPrice(
                String(
                  menuPrice + menuOption1?.price + menuOption2?.price + deliveryPrice - menuDiscount - eventDiscount
                )
              )
            : getFormatPrice(String(menuPrice + deliveryPrice - menuDiscount - eventDiscount))}
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
    </MenuPriceContainer>
  );
};
const Container = styled.div``;
export const MenuPriceContainer = styled.div`
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
export const MenuPriceUl = styled.ul`
  padding-bottom: 16px;
`;
export const MenuPriceLi = styled.li<{ padding?: string }>`
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
const Badge = styled.div`
  padding: 4px 8px;
  margin-right: 4px;
  background-color: ${theme.brandColor5P};
  color: ${theme.brandColor};
`;
export default MenusPriceBox;
