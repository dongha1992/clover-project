import { TextB2R, TextH5B } from '@components/Shared/Text';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { theme } from '@styles/theme';
import { getFormatDate } from '@utils/common';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
interface IProps {
  unsubscriptionMessage: string;
  lastDeliveryDateOrigin: string;
}
const SubsCloseSheet = ({ unsubscriptionMessage, lastDeliveryDateOrigin }: IProps) => {
  const dispatch = useDispatch();

  return (
    <SubsCloseSheetContainer>
      <TextH5B center padding="0 0 16px">
        정기구독 결제 실패 안내
      </TextH5B>
      <TextB2R padding="0 0 16px" wordBreak="keep-all">
        아래와 같은 사유로 정기구독이 해지될 예정이에요. 서비스 이용에 불편을 드려 죄송합니다.
      </TextB2R>
      <ul className="infoBox">
        <li>
          <TextH5B color={theme.greyScale65}>정기구독 해지일 : {getFormatDate(lastDeliveryDateOrigin)}</TextH5B>
        </li>
        <li>
          <TextH5B color={theme.greyScale65}>구독 해지 사유 : {unsubscriptionMessage}</TextH5B>
        </li>
      </ul>
      <BottomButton
        onClick={() => {
          dispatch(INIT_BOTTOM_SHEET());
        }}
      >
        확인했어요
      </BottomButton>
    </SubsCloseSheetContainer>
  );
};
const SubsCloseSheetContainer = styled.div`
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
`;

export default SubsCloseSheet;
