import { TextB1B, TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { FlexRow, theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import CardItem from '@components/Pages/Mypage/Card/CardItem';
interface IProps {
  previewOrder: any;
  goToCardManagemnet: any;
  getMainCardHandler: any;
}
const SubsPaymentMethod = ({ previewOrder, goToCardManagemnet, getMainCardHandler }: IProps) => {
  const goToRegisteredCard = () => {
    router.push('/mypage/card/register');
  };
  return (
    <SubsPaymentMethodContainer>
      <CardBox>
        <TextB1B padding="0 0 8px">결제수단</TextB1B>
        <TextB2R padding="0 0 24px" color={theme.greyScale65}>
          등록한 카드로 자동/정기결제가 진행됩니다.
        </TextB2R>
        {previewOrder?.cards?.length! > 0 ? (
          <>
            <CardItem onClick={goToCardManagemnet} card={getMainCardHandler(previewOrder?.cards!)} />
            <Button
              border
              backgroundColor={theme.white}
              color={theme.black}
              onClick={goToRegisteredCard}
              margin="16px 0 0 0"
            >
              정기결제 등록하기
            </Button>
          </>
        ) : (
          <Button border backgroundColor={theme.white} color={theme.black} onClick={goToRegisteredCard}>
            정기결제 등록하기
          </Button>
        )}
      </CardBox>
      <ExBox>
        <FlexRow className="titleBox">
          <SVGIcon name="calendar" />
          <TextH5B className="title">
            정기결제일은 <span>매달 20일</span> 입니다.
          </TextH5B>
        </FlexRow>
        <ul className="exList">
          <li>
            <TextB3R color={theme.greyScale65}>다음 결제일 7일 전 식단 및 할인율, 결제금액이 확정됩니다.</TextB3R>
          </li>
          <li>
            <TextB3R color={theme.greyScale65}>매달 회차와 상품의 차이로 금액이 변동될 수 있습니다.</TextB3R>
          </li>
          <li>
            <TextB3R color={theme.greyScale65}>다음 결제 시점까지 식단을 확인하고 취소할 수 있습니다.</TextB3R>
          </li>
          <li>
            <TextB3R color={theme.greyScale65}>구독 관리에서 다음 결제정보를 변경할 수 있습니다.</TextB3R>
          </li>
          <li>
            <TextB3R color={theme.greyScale65}>등록된 카드의 잔액 부족 시 구독이 취소될 수 있습니다.</TextB3R>
          </li>
        </ul>
      </ExBox>
      <TextH5B padding="10px 0" backgroundColor={theme.brandColor} color="#fff" center>
        1월 20일 (목) 구독 1회차 결제가 진행됩니다.
      </TextH5B>
    </SubsPaymentMethodContainer>
  );
};
const SubsPaymentMethodContainer = styled.div``;
const CardBox = styled.div`
  padding: 24px;
`;
const ExBox = styled.div`
  padding: 0 24px 24px;
  .titleBox {
    padding-top: 24px;
    border-top: 1px solid #f2f2f2;
    svg {
      margin-right: 8px;
    }
    .title {
      line-height: 1;
      padding-top: 3px;
      span {
        color: ${theme.brandColor};
      }
    }
  }
  .exList {
    padding-top: 16px;
    li {
      position: relative;
      padding-left: 20px;
      &::after {
        content: '';
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 3px;
        left: 9px;
        top: 7.5px;
        background-color: ${theme.greyScale65};
      }
    }
  }
`;
export default SubsPaymentMethod;
