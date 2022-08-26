import SubsDiscountSheet from '@components/BottomSheet/SubsSheet/SubsDiscountSheet';
import { TextB2R, TextB3R, TextH4B, TextH5B, TextH7B } from '@components/Shared/Text';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { FlexBetween, FlexEnd, FlexRow, theme } from '@styles/theme';
import { getFormatPrice, SVGIcon } from '@utils/common';
import { calculatePoint } from '@utils/menu';
import { useDispatch } from 'react-redux';
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
  type?: string | 'progress' | 'last' | 'management';
  deliveryType: string;
  subscriptionDiscountRates: number[];
  grade: any;
  coupon?: number;
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
  type,
  deliveryType,
  subscriptionDiscountRates,
  grade,
  coupon,
}: IProps) => {
  const dispatch = useDispatch();

  const subsDiscountInfoHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SubsDiscountSheet subscriptionDiscountRates={subscriptionDiscountRates} />,
      })
    );
  };

  return (
    <MenuPriceContainer className={type}>
      <FlexBetween padding="0 0 16px" margin="0 0 16px" className="bbN">
        <TextH5B>총 상품금액</TextH5B>
        <TextB2R>{getFormatPrice(String(menuPrice))}원</TextB2R>
      </FlexBetween>
      <MenuPriceUl>
        <MenuPriceLi>
          <TextH5B>총 할인금액</TextH5B>
          {coupon ? (
            <TextB2R>
              {menuDiscount + eventDiscount + coupon! !== 0
                ? `-${getFormatPrice(String(menuDiscount + eventDiscount + coupon!))}`
                : 0}
              원
            </TextB2R>
          ) : (
            <TextB2R>
              {menuDiscount + eventDiscount !== 0 ? `-${getFormatPrice(String(menuDiscount + eventDiscount))}` : 0}원
            </TextB2R>
          )}
          {/* <TextB2R>-{getFormatPrice(String(menuDiscount))}원</TextB2R> */}
        </MenuPriceLi>
        {menuDiscount !== 0 && (
          <MenuPriceLi>
            <FlexRow onClick={subsDiscountInfoHandler} pointer>
              <TextB2R>구독 할인</TextB2R>
              <SVGIcon name="questionMark" />
            </FlexRow>
            <TextB2R>{menuDiscount ? `-${getFormatPrice(String(menuDiscount))}` : 0}원</TextB2R>
          </MenuPriceLi>
        )}
        {eventDiscount !== 0 && (
          <MenuPriceLi>
            <TextB2R>이벤트 할인</TextB2R>
            <TextB2R>{eventDiscount ? `-${getFormatPrice(String(eventDiscount))}` : 0}원</TextB2R>
          </MenuPriceLi>
        )}
        {coupon !== undefined && (
          <MenuPriceLi>
            <TextB2R>쿠폰 사용</TextB2R>
            <TextB2R>{coupon !== 0 && coupon ? `-${getFormatPrice(String(coupon))}` : 0}원</TextB2R>
          </MenuPriceLi>
        )}
      </MenuPriceUl>
      <MenuPriceUl>
        <MenuPriceLi className="btN" padding="16px 0 0">
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
        <TextH4B>{type === 'last' || type === 'management' ? '최종 결제금액' : '결제예정금액'}</TextH4B>
        <TextH4B>
          {disposable
            ? getFormatPrice(
                String(
                  menuPrice +
                    menuOption1?.price +
                    menuOption2?.price +
                    deliveryPrice -
                    menuDiscount -
                    eventDiscount -
                    (coupon ?? 0)
                  // menuPrice + menuOption1?.price + menuOption2?.price + deliveryPrice - menuDiscount
                )
              )
            : // : getFormatPrice(String(menuPrice + deliveryPrice - menuDiscount))}
              getFormatPrice(String(menuPrice + deliveryPrice - menuDiscount - eventDiscount - (coupon ?? 0)))}
          원
        </TextH4B>
      </FlexBetween>
      <FlexEnd>
        <Badge>
          <TextH7B>{grade?.name!}</TextH7B>
        </Badge>
        <TextB3R>
          구매 시
          <b>
            {getFormatPrice(
              String(
                calculatePoint({
                  rate: grade.benefit.accumulationRate!,
                  total: disposable
                    ? menuPrice + menuOption1?.price + menuOption2?.price + deliveryPrice - menuDiscount
                    : menuPrice + deliveryPrice - menuDiscount,
                })
              )
            )}
            P ({grade.benefit.accumulationRate}%) 적립 예정
          </b>
        </TextB3R>
      </FlexEnd>
    </MenuPriceContainer>
  );
};

export const MenuPriceContainer = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  &.management {
    background-color: #fff;
  }
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
  div {
    color: ${theme.brandColor};
  }
`;
export default MenusPriceBox;
