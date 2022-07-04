import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';

const CardTermPage = () => {
  return (
    <Container>
      <TextB3R color={theme.greyScale65}>
        카드번호, 비밀번호 등 민감한 정보는 이용가맹점에서 절대로 보관하지 않습니다.
        <br />
        <br />
        귀하가 신청하신 신용카드 정기출금 결제는 결제대행사 나이스정보통신(주)에서 대행합니다.
        <br />
        <br />
        따라서, 귀하의 신용카드 결제내역에는 정기출금과 관련한 이용가맹점이 결제대행사로 표기되오니 이점 착오 없으시기
        발바니다.
        <br />
        <br />
        또한 결제대행사는 정기출금 결제대행만을 수행하므로, 정기출금 결제신청 해지 등과 관련한 모든 업무는 해당 인터넷
        상점을 통해 직접 요청하셔야 합니다.
        <br />
        <br />
        결제대행사는 귀하의 본 신청과 관련된 거래내역을 e-mail로 통보 드리며, 별도 조회를 각 결제대행사 사이트에서
        이용하실 수 있도록 하고 있습니다. 결제대행사는 이러한 별도 서비스 제공을 위해 필요한 최소정보만(성명, e-mail)을
        해당 인터넷 상점으로부터 수령하여 보관하게 됩니다.
      </TextB3R>
    </Container>
  );
};
const Container = styled.div`
  padding: 24px;
  min-height: calc(100vh - 56px);
  background-color: ${theme.greyScale3};
`;

export default CardTermPage;
