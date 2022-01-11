import { Button } from '@components/Shared/Button';
import { TextB3R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
interface IProps {
  item: any;
}

const OrderDetailSheet = ({ item }: IProps) => {
  return (
    <Container>
      <Title>
        <TextH5B>배송방법</TextH5B>
      </Title>
      <OrderInfo className="row1">
        <TextH6B color={theme.black}>{item.orderTime}</TextH6B>
        <span></span>
        <TextH6B color={theme.black}>{item.msg}</TextH6B>
      </OrderInfo>
      <AdressInfo>
        <div className="address">
          <TextH4B color={theme.black}>
            <SVGIcon name={'blackMapIcon'} /> 헤이그라운드 서울숲점
          </TextH4B>
          <TextB3R color={theme.greyScale65}>
            서울시 성동구 왕십리로 115, 708호
          </TextB3R>
        </div>
        <OrderButton type="button">주문하기</OrderButton>
      </AdressInfo>
      <ProductInfo>
        <TextH6B>터키 브레스토</TextH6B>
        <TextB3R>
          ㅁㄴㅇㄹㅁㄴㅇㄹㅇㅁㄴㄹㅁㄴㅇㄹㅁㄴㅇㄹㅇㄴㅁㄹㅇㅁㄹㅁㄴㄹ
          ㅁㄴㅇㄹㅁㄴㅇㄹㅇㅁㄴㄹㅁㄴㅇㄹㅁㄴㅇㄹㅇㄴㅁㄹㅇㅁㄹㅁㄴㄹ
          ㅁㄴㅇㄹㅁㄴㅇㄹㅇㅁㄴㄹㅁㄴㅇㄹㅁㄴㅇㄹㅇㄴㅁㄹㅇㅁㄹㅁㄴㄹ
        </TextB3R>
      </ProductInfo>
      <ButtonContainer onClick={() => {}}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
        </Button>
      </ButtonContainer>
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  padding: 24px;
`;
const Title = styled.h2`
  display: flex;
  justify-content: center;
`;
const OrderInfo = styled.article`
  display: flex;
  width: 100%;
  height: 18px;
  align-items: center;
  margin-bottom: 16px;
  span {
    display: inline-block;
    width: 1px;
    height: 12px;
    margin: 0 8px;
    background-color: #242424;
  }
`;
const AdressInfo = styled.article`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 16px;
  .address {
    svg {
      margin-right: 4px;
    }
  }
`;
const ProductInfo = styled.article``;

const OrderButton = styled.button`
  background-color: transparent;
  border: 1px solid #242424;
  border-radius: 8px;
  color: #242424;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.4px;
  display: block;
  height: auto;
  width: 75px;
  height: 38px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 56px;
`;

export default OrderDetailSheet;
