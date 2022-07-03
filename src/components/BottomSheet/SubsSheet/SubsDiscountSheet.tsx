import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { FlexRow, theme } from '@styles/theme';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
interface IProps {
  subscriptionDiscountRates: number[];
}
const SubsDiscountSheet = ({ subscriptionDiscountRates }: IProps) => {
  const dispatch = useDispatch();
  return (
    <SubsDiscountSheetContainer>
      <TextH4B padding="24px 0" center>
        구독 할인
      </TextH4B>
      <ul>
        <li>
          <TextH5B>1주 구독</TextH5B>
          <FlexRow>
            <TextB2R>
              <Span>{subscriptionDiscountRates[0]}%</Span> 할인
            </TextB2R>
          </FlexRow>
        </li>
        <li>
          <TextH5B>2주 구독</TextH5B>
          <FlexRow>
            <TextB2R>
              <Span>{subscriptionDiscountRates[1]}%</Span> 할인
            </TextB2R>
          </FlexRow>
        </li>
        <li>
          <TextH5B>3주 구독</TextH5B>
          <FlexRow>
            <TextB2R>
              <Span>{subscriptionDiscountRates[2]}%</Span> 할인
            </TextB2R>
          </FlexRow>
        </li>
        <li>
          <TextH5B>4주 구독</TextH5B>
          <FlexRow>
            <TextB2R>
              <Span>{subscriptionDiscountRates[3]}%</Span> 할인
            </TextB2R>
          </FlexRow>
        </li>
        <li>
          <TextH5B>정기구독</TextH5B>
          <FlexRow>
            <TextB2R>
              최대 <Span>{subscriptionDiscountRates[4]}%</Span> 할인
            </TextB2R>
          </FlexRow>
        </li>
      </ul>
      <TextB3R color={theme.brandColor} padding="4px 0 24px">
        정기구독의 경우 구독 결제 기간에 따라 할인율이 점차 증가합니다. <br />
        (1개월 {subscriptionDiscountRates[3]}% / 2개월 {subscriptionDiscountRates[5]}% / 3개월{' '}
        {subscriptionDiscountRates[6]}% / 4개월 {subscriptionDiscountRates[7]}%)
      </TextB3R>
      <BottomButton
        onClick={() => {
          dispatch(INIT_BOTTOM_SHEET());
        }}
      >
        <TextH5B>확인</TextH5B>
      </BottomButton>
    </SubsDiscountSheetContainer>
  );
};
const SubsDiscountSheetContainer = styled.div`
  padding: 0 24px;
  ul {
    li {
      display: flex;
      justify-content: space-between;
      padding-bottom: 16px;
    }
  }
`;

const Span = styled.span`
  color: ${theme.brandColor};
  font-weight: bold;
`;

const BottomButton = styled.button`
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

export default SubsDiscountSheet;
