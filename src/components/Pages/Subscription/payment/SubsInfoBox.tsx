import { TextB2R, TextH4B, TextH5B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { FlexBetween, FlexBetweenStart, FlexColEnd } from '@styles/theme';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

interface IProps {
  subscriptionRound: number;
  deliveryDayLength: number;
  deliveryDay: string;
  datePeriodFirst: string;
  datePeriodLast: string;
}

const SubsInfoBox = ({
  subscriptionRound,
  deliveryDayLength,
  deliveryDay,
  datePeriodFirst,
  datePeriodLast,
}: IProps) => {
  const { subsInfo } = useSelector(subscriptionForm);
  return (
    <SubsInfoBoxContainer>
      <TextH4B padding="0 0 24px 0">구독정보</TextH4B>
      <FlexBetween padding="0 0 16px">
        <TextH5B>배송주기</TextH5B>
        <TextB2R>
          주 {deliveryDayLength}회 / {deliveryDay}
        </TextB2R>
      </FlexBetween>
      <FlexBetweenStart>
        <TextH5B>배송주기</TextH5B>
        <FlexColEnd>
          <TextB2R>정기구독 {subscriptionRound}회차</TextB2R>
          <TextB2R>
            {datePeriodFirst} ~ {datePeriodLast}
          </TextB2R>
        </FlexColEnd>
      </FlexBetweenStart>
    </SubsInfoBoxContainer>
  );
};
const SubsInfoBoxContainer = styled.div`
  padding: 24px;
`;
export default SubsInfoBox;
