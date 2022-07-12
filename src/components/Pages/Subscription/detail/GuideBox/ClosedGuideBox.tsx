import { TextB2R, TextH5B } from '@components/Shared/Text';
import { FlexRow, theme } from '@styles/theme';
import { getFormatDate, subsClosedDate, SVGIcon } from '@utils/common';
import styled from 'styled-components';

interface IProps {
  type: string | 'closeReserved' | 'closed';
  isChanged: boolean;
  unsubscriptionMessage: string;
  subscriptionPaymentDate: string;
}

const ClosedGuideBox = ({ type, isChanged, unsubscriptionMessage, subscriptionPaymentDate }: IProps) => {
  return (
    <ClosedGuidContainer>
      <FlexRow padding="0 0 8px">
        <SVGIcon name="exclamationMark" />
        <TextH5B padding="2px 0 0 4px " color={theme.brandColor}>
          정기구독 결제 실패 안내
        </TextH5B>
      </FlexRow>
      {type === 'closeReserved' && isChanged && (
        <TextB2R color={theme.brandColor}>
          결제 실패로 정기구독이 해지될 예정이에요. 최종 결제 전까지 실패 사유 확인 후 변경해 주세요.
        </TextB2R>
      )}
      {type === 'closeReserved' && !isChanged && (
        <TextB2R color={theme.brandColor}>
          아래와 같은 사유로 정기구독이 해지될 예정이에요. 서비스 이용에 불편을 드려 죄송합니다.
        </TextB2R>
      )}
      {type === 'closed' && (
        <TextB2R color={theme.brandColor}>
          아래와 같은 사유로 정기구독이 해지됐어요. 서비스 이용에 불편을 드려 죄송합니다.
        </TextB2R>
      )}
      <ul>
        <li>
          {!isChanged ? (
            <TextH5B color={theme.brandColor}>
              최종 결제일시 : {getFormatDate(subscriptionPaymentDate)} 오후 9시
            </TextH5B>
          ) : (
            <TextH5B color={theme.brandColor}>정기구독 해지일 : {subsClosedDate(subscriptionPaymentDate)}</TextH5B>
          )}
        </li>
        <li>
          <TextH5B color={theme.brandColor}>결제 실패 사유 : {unsubscriptionMessage}</TextH5B>
        </li>
      </ul>
    </ClosedGuidContainer>
  );
};
const ClosedGuidContainer = styled.div`
  margin-top: 16px;
  padding: 24px;
  background-color: #f5fbf8;
  border-radius: 8px;
  ul {
    padding-top: 8px;
    li {
      padding-left: 19px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        background-color: ${theme.brandColor};
        width: 4px;
        height: 4px;
        border-radius: 50%;
        top: 8px;
        left: 8px;
      }
    }
  }
`;
export default ClosedGuideBox;
