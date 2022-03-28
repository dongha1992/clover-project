import React from 'react';
import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { Obj } from '@model/index';
interface IProps {
  status: string;
  count?: number;
  date?: string;
}

const InfoMessage = ({ status, count, date }: IProps) => {
  const mapper: Obj = {
    soldSoon: `품절 임박! 상품이 ${count}개 남았어요`,
    hasLimit: `해당 상품은 최대 ${count}개까지 구매 가능해요`,
    deliveryDate: `해당상품은 ${date} 부터 배송 가능해요`,
    soldOut: `품절된 상품이에요.`,
  };
  return (
    <Container>
      <SVGIcon name="exclamationMark" />
      <div>
        <TextB3R padding="4px 0 0 4px" color={theme.brandColor}>
          {mapper[status]}
        </TextB3R>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export default React.memo(InfoMessage);
