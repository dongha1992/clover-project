import { fixedBottom, FlexCol, homePadding, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextB2R } from '@components/Shared/Text';
import Button from '@components/Shared/Button';
import { userUnlock } from '@api/user';
import router from 'next/router';
import { setAlert } from '@store/alert';
import { useDispatch } from 'react-redux';

const DormantAccountPage = () => {
  const dispatch = useDispatch();

  const getUserUnlock = async () => {
    try {
      const { data } = await userUnlock();

      if (data.code === 200) {
        dispatch(
          setAlert({
            alertMessage:
              '휴면 상태가  해제되었습니다. 프레시코드의 모든 서비스를 정상 이용 가능합니다.',
            submitBtnText: '확인',
            onSubmit: () => router.push('/home'),
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <FlexCol padding="39px 0 32px">
          <TextH2B>회원님의 아이디는</TextH2B>
          <TextH2B>휴면 상태입니다.</TextH2B>
        </FlexCol>
        <FlexCol>
          <TextB2R color={theme.greyScale65} padding="0 0 24px 0">
            프레시코드는 회원님의 계정을 안전하게 보호하기 위해 1년 이상
            로그인하지 않은 아이디는 휴면계정으로 분리 보관합니다.
          </TextB2R>
          <TextB2R color={theme.greyScale65}>
            휴면 상태를 해제하면 프레시코드 모든 서비스의 사용이 가능합니다.
          </TextB2R>
        </FlexCol>
      </Wrapper>
      <BtnWrapper onClick={getUserUnlock}>
        <Button>휴면상태 해제하기</Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

const Wrapper = styled.div``;
const BtnWrapper = styled.div`
  ${fixedBottom}
`;

export default DormantAccountPage;
