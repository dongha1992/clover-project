import { TextH2B } from '@components/Shared/Text';
import { userForm } from '@store/user';
import { theme } from '@styles/theme';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

interface IProps {
  subsCount: number;
}
const InfoCard = ({ subsCount }: IProps) => {
  const { isLoginSuccess, me } = useSelector(userForm);

  return (
    <Container>
      {isLoginSuccess &&
        (subsCount === 0 ? (
          <TextH2B>
            <span>{me?.nickname}</span>님 <br />
            건강한 식단을 구독해 보세요!
          </TextH2B>
        ) : (
          <TextH2B>
            <span>{me?.nickname}</span>님 <br />
            건강한 식단을 구독 중이에요!
          </TextH2B>
        ))}
      {isLoginSuccess === false && (
        <TextH2B>
          프레시코드의 <br />
          건강한 식단을 구독해 보세요!
        </TextH2B>
      )}
    </Container>
  );
};
const Container = styled.div`
  padding: 24px 24px 48px;
  & > div span {
    color: ${theme.brandColor};
  }
`;
export default InfoCard;
