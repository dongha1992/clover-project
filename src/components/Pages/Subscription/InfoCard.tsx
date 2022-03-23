import { TextH2B } from '@components/Shared/Text';
import { userForm } from '@store/user';
import { theme } from '@styles/theme';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

interface IProps {
  subsList: any;
}

const InfoCard = ({ subsList }: IProps) => {
  const { isLoginSuccess, me } = useSelector(userForm);

  return (
    <Container>
      {isLoginSuccess &&
        (subsList?.length !== 0 ? (
          <TextH2B>
            <span>{me?.nickName}</span>님 <br />
            건강한 식단을 구독해 보세요!
          </TextH2B>
        ) : (
          <TextH2B>
            건강한 식단 <br />
            136일째 진행 중 🥗
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
