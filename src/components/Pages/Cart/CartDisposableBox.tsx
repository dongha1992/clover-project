import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH4B, TextH5B, TextH6B, TextH7B, TextB3R, TextH3B } from '@components/Shared/Text';
import { FlexBetween } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import BorderLine from '@components/Shared/BorderLine';
import { IDisposable } from '@model/index';

interface IProps {
  disposableList: IDisposable[];
  disposableItems: { quantity: number; price: number };
}

const CartDisposableBox = ({ disposableList, disposableItems }: IProps) => {
  return (
    <>
      {disposableList.some((item: IDisposable) => item.isSelected) && (
        <>
          <BorderLine height={1} margin="16px 0" />
          <FlexBetween padding="0px">
            <TextH5B>환경부담금 (일회용품)</TextH5B>
            <TextB2R>
              {disposableItems.quantity}개 / {getFormatPrice(String(disposableItems.price))}원
            </TextB2R>
          </FlexBetween>
        </>
      )}
      {disposableList.length > 0 &&
        disposableList.map((disposable, index) => {
          const { id, quantity, price, isSelected } = disposable;
          const hasFork = id === 1 && isSelected;
          const hasChopsticks = id === 2 && isSelected;
          return (
            <div key={index}>
              {hasFork && (
                <FlexBetween padding="8px 0 0 0">
                  <TextB2R>포크+물티슈</TextB2R>
                  <TextB2R>
                    {quantity}개 / {getFormatPrice(String(price * quantity))}원
                  </TextB2R>
                </FlexBetween>
              )}
              {hasChopsticks && (
                <FlexBetween padding="8px 0 0 0">
                  <TextB2R>젓가락+물티슈</TextB2R>
                  <TextB2R>
                    {quantity}개 / {getFormatPrice(String(price * quantity))}원
                  </TextB2R>
                </FlexBetween>
              )}
            </div>
          );
        })}
    </>
  );
};

export default React.memo(CartDisposableBox);
