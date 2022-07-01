import { TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import styled from 'styled-components';
interface IProps {
  subscriptionRound: any;
}
const SubsProgressBoard = ({ subscriptionRound }: IProps) => {
  return (
    <BoardContainer>
      <TextB2R>
        건강한 식단을 <b>{subscriptionRound}회</b> 구독 중이에요.
      </TextB2R>
    </BoardContainer>
  );
};
const BoardContainer = styled.div`
  background-color: ${theme.greyScale3};
  margin-top: 15px;
  border-radius: 8px;
  padding: 16px;
  b {
    color: ${theme.brandColor};
    font-weight: bold;
  }
`;
export default SubsProgressBoard;
