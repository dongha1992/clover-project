import React from 'react';
import styled from 'styled-components';
import BorderLine from '@components/Shared/BorderLine';
import { FlexBetween, FlexEnd, theme } from '@styles/theme';
import { TextB2R, TextH4B, TextB3R, TextH6B, TextH5B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { IUserInputObj } from '@model/index';
import { getFormatPrice } from '@utils/common';
import { calculatePoint } from '@utils/menu';
interface IProps {
  menuAmount: number;
  menuDiscount: number;
  eventDiscount: number;
  userInputObj: IUserInputObj;
  optionAmount: number;
  orderOptions: any;
  deliveryFee: number;
  deliveryFeeDiscount: number;
  payAmount: number;
  grade: any;
}

const GeneralMenusPriceBox = ({
  menuAmount,
  menuDiscount,
  eventDiscount,
  userInputObj,
  optionAmount,
  orderOptions,
  deliveryFee,
  deliveryFeeDiscount,
  payAmount,
  grade,
}: IProps) => {
  const total = payAmount - (userInputObj.point + (userInputObj.coupon! || 0));
  const totalDiscount = menuDiscount + eventDiscount + userInputObj.coupon;
  return (
    <TotalPriceWrapper>
      <FlexBetween>
        <TextH5B>총 상품 금액</TextH5B>
        <TextB2R>{getFormatPrice(String(menuAmount))}원</TextB2R>
      </FlexBetween>
      <BorderLine height={1} margin="16px 0" />
      <FlexBetween padding="8px 0 0 0">
        <TextH5B>총 할인 금액</TextH5B>
        <TextB2R>{getFormatPrice(String(totalDiscount))}원</TextB2R>
      </FlexBetween>
      {menuDiscount > 0 && (
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>상품 할인</TextB2R>
          <TextB2R>-{getFormatPrice(String(menuDiscount))}원</TextB2R>
        </FlexBetween>
      )}

      {eventDiscount > 0 && (
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>스팟 이벤트 할인</TextB2R>
          <TextB2R>-{getFormatPrice(String(eventDiscount))}원</TextB2R>
        </FlexBetween>
      )}
      {userInputObj.coupon > 0 && (
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>쿠폰 사용</TextB2R>
          <TextB2R>-{getFormatPrice(String(userInputObj.coupon))}원</TextB2R>
        </FlexBetween>
      )}
      <BorderLine height={1} margin="8px 0" />
      <FlexBetween padding="8px 0 0 0">
        <TextH5B>환경부담금 (일회용품)</TextH5B>
        <TextB2R>{getFormatPrice(String(optionAmount))}원</TextB2R>
      </FlexBetween>
      {orderOptions.length > 0 &&
        orderOptions.map((optionItem: any, index: number) => {
          const { optionId, optionPrice, optionQuantity, optionName } = optionItem;
          const hasFork = optionId === 1;
          const hasChopsticks = optionId === 2;
          return (
            <div key={index}>
              {hasFork && (
                <FlexBetween padding="8px 0 0 0">
                  <TextB2R>포크+물티슈</TextB2R>
                  <TextB2R>
                    {optionQuantity}개 / {getFormatPrice(String(optionPrice * optionQuantity))}원
                  </TextB2R>
                </FlexBetween>
              )}
              {hasChopsticks && (
                <FlexBetween padding="8px 0 0 0">
                  <TextB2R>젓가락+물티슈</TextB2R>
                  <TextB2R>
                    {optionQuantity}개 / {getFormatPrice(String(optionPrice * optionQuantity))}원
                  </TextB2R>
                </FlexBetween>
              )}
            </div>
          );
        })}
      <BorderLine height={1} margin="16px 0" />
      <FlexBetween>
        <TextH5B>배송비</TextH5B>
        <TextB2R>{deliveryFee > 0 ? `${getFormatPrice(String(deliveryFee))}원` : '무료배송'}</TextB2R>
      </FlexBetween>
      {deliveryFeeDiscount > 0 && (
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>배송비 할인</TextB2R>
          <TextB2R>{getFormatPrice(String(deliveryFeeDiscount))}원</TextB2R>
        </FlexBetween>
      )}
      <BorderLine height={1} margin="16px 0" />
      {userInputObj.point > 0 && (
        <FlexBetween>
          <TextH5B>포인트 사용</TextH5B>
          <TextB2R>{getFormatPrice(String(userInputObj.point))}원</TextB2R>
        </FlexBetween>
      )}
      <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
      <FlexBetween>
        <TextH4B>최종 결제금액</TextH4B>
        <TextH5B>{getFormatPrice(String(total))}원</TextH5B>
      </FlexBetween>
      <FlexEnd padding="11px 0 0 0">
        <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
          {grade?.name!}
        </Tag>
        <TextB3R padding="0 0 0 3px">구매 시 </TextB3R>
        <TextH6B>
          {calculatePoint({
            rate: grade.benefit.accumulationRate!,
            total: total + userInputObj.point,
          })}
          P ({grade.benefit.accumulationRate}%) 적립 예정
        </TextH6B>
      </FlexEnd>
    </TotalPriceWrapper>
  );
};

const TotalPriceWrapper = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  display: flex;
  flex-direction: column;
`;

export default GeneralMenusPriceBox;
