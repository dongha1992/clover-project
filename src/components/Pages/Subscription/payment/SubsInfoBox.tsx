import { TextB2R, TextH4B, TextH5B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { FlexBetween, FlexBetweenStart, FlexColEnd } from '@styles/theme';
import { getFormatDate } from '@utils/common';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const SubsInfoBox = ({ subscriptionRound }: { subscriptionRound: number }) => {
  const { subsInfo } = useSelector(subscriptionForm);
  return (
    <SubsInfoBoxContainer>
      <TextH4B padding="0 0 24px 0">구독정보</TextH4B>
      <FlexBetween padding="0 0 16px">
        <TextH5B>배송주기</TextH5B>
        <TextB2R>
          주 {subsInfo?.deliveryDay?.length}회 / {subsInfo?.deliveryDay?.join('·')}
        </TextB2R>
      </FlexBetween>
      <FlexBetweenStart>
        <TextH5B>배송주기</TextH5B>
        <FlexColEnd>
          <TextB2R>정기구독 {subscriptionRound}회차</TextB2R>
          <TextB2R>
            {getFormatDate(subsInfo?.datePeriod![0])} ~ {getFormatDate(subsInfo?.datePeriod![1])}
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
