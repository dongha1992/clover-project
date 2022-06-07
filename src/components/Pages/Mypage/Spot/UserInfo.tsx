import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { IGetRegistrationStatus } from '@model/index';

interface IParams {
  item: IGetRegistrationStatus;
};
const UserInfo = ({ item }: IParams) => {

  return (
    <Container>
      <TextH5B margin='0 0 8px 0'>이름</TextH5B>
      <TextB3R margin='0 0 24px 0'>{item?.userName}</TextB3R>
      <TextH5B margin='0 0 8px 0'>이메일</TextH5B>
      <TextB3R margin='0 0 24px 0'>{item?.userEmail}</TextB3R>
      <TextH5B margin='0 0 8px 0'>휴대폰 번호</TextH5B>
      <TextB3R>{item?.userTel}</TextB3R>
      {
        item?.type === 'OWNER' && (
          <>
            <TextH5B margin='24px 0 8px 0'>직급/호칭</TextH5B>
            <TextB3R>{item?.userPosition}</TextB3R>
          </>
        )
      }
    </Container>
  )
};

const Container = styled.div`
  padding: 0 24px 24px 24px;
`;

export default UserInfo;
