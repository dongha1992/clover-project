import React, { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { 
    INIT_SPOT_LOCATION, 
    INIT_SPOT_REGISTRATIONS_OPTIONS, 
    INIT_SPOT_REGISTRATIONS_INFO,
  } from '@store/spot';  

const RegistrationsListPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const goToPrivateRegistrations = () => {
    router.push('/spot/register?type=private');
  };

  const goToPublicRegistrations = () => {
    router.push('/spot/register?type=public'); 
  };

  const goToOwnerRegistrations = () => {
    router.push('/spot/register?type=owner'); 
  };

  useEffect(()=> {
    dispatch(INIT_SPOT_LOCATION());
    dispatch(INIT_SPOT_REGISTRATIONS_OPTIONS());
    dispatch(INIT_SPOT_REGISTRATIONS_INFO());
  }, []);

  return (
    <Container>
     <BtnWrapper onClick={goToPrivateRegistrations}>
        프라이빗 프코스팟 신청하기
     </BtnWrapper>
     <BtnWrapper onClick={goToPublicRegistrations}>
        단골가게 신청하기
     </BtnWrapper>
     <BtnWrapper onClick={goToOwnerRegistrations}>
        우리가게 신청하기
     </BtnWrapper>
    </Container>
  );
};

const Container = styled.main`
  padding: 24px;
`;

const BtnWrapper = styled.div`
  width: 50%;
  height: 60px;
  background: ${theme.greyScale25};
  margin-bottom: 15px;
  cursor: pointer;
`;

export default RegistrationsListPage;