import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import useSubsPaymentFail from '@hooks/subscription/useSubsPaymentFail';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { FlexBetween, theme } from '@styles/theme';
import { getSubsPaymentDate } from '@utils/subscription/getSubsPaymentDate';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
interface IProps {
  subsFailType: string;
  firstDeliveryDateOrigin: string;
  unsubscriptionMessage: string;
  orderId: number;
  destinationId: number;
}
const SubsFailSheet = ({
  subsFailType,
  firstDeliveryDateOrigin,
  unsubscriptionMessage,
  orderId,
  destinationId,
}: IProps) => {
  const dispatch = useDispatch();

  const { month, day, dd } = getSubsPaymentDate(firstDeliveryDateOrigin);

  const changeHandler = () => {
    if (subsFailType === 'payment') {
      router.push({
        pathname: '/mypage/card',
        query: { isOrder: true, orderId, isSubscription: true },
      });
    } else if (subsFailType === 'destination') {
      router.push({
        pathname: `/mypage/order-detail/edit/${orderId}`,
        query: { destinationId, isSubscription: true },
      });
    }
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <SubsFailSheetContainer>
      <TextH5B center padding="0 0 16px">
        정기구독 결제 실패 안내
      </TextH5B>
      <TextB2R padding="0 0 16px" wordBreak="keep-all">
        아래와 같은 사유로 정기구독이 해지될 예정이에요. 확인 후 계속해서 구독을 이어나가 보세요!
      </TextB2R>
      <ul className="infoBox">
        <li>
          <TextH5B color={theme.greyScale65}>
            최종 결제일시 : {month}월 {day}일 ({dd}) 오후 9시
          </TextH5B>
        </li>
        <li>
          <TextH5B color={theme.greyScale65}>결제 실패 사유 : {unsubscriptionMessage}</TextH5B>
        </li>
      </ul>
      <BottomButton>
        <FlexBetween height="100%">
          <TextH5B
            width="50%"
            height="100%"
            center
            className="btn line"
            onClick={() => {
              dispatch(INIT_BOTTOM_SHEET());
            }}
          >
            닫기
          </TextH5B>
          <TextH5B width="50%" height="100%" center className="btn" onClick={changeHandler}>
            변경하기
          </TextH5B>
        </FlexBetween>
      </BottomButton>
    </SubsFailSheetContainer>
  );
};
const SubsFailSheetContainer = styled.div`
  padding: 24px 24px 0 24px;
  ul.infoBox {
    padding: 16px;
    border-radius: 8px;
    background-color: #f8f8f8;
    margin-bottom: 24px;
    li {
      position: relative;
      padding-left: 16px;
      &::after {
        content: '';
        width: 3px;
        height: 3px;
        background-color: ${theme.greyScale65};
        border-radius: 3px;
        position: absolute;
        top: 8.5px;
        left: 6.5px;
      }
    }
  }
`;

const BottomButton = styled.button`
  padding: 0;
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  background-color: ${theme.black};
  color: #fff;
  &:disabled {
    background-color: ${theme.greyScale6};
    color: ${theme.greyScale25};
  }
  .btn {
    position: relative;
    line-height: 56px;
    width: 100%;
  }
  .line::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 24px;
    background-color: #fff;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export default SubsFailSheet;
