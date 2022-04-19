import React, { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextB1B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { 
    INIT_SPOT_LOCATION, 
    INIT_SPOT_REGISTRATIONS_OPTIONS, 
  } from '@store/spot';  
import { SET_ALERT } from '@store/alert';

const RegistrationsListPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const goToPrivateRegistrations = () => {
    router.push('/spot/spot-req?type=private');
  };

  const goToPublicRegistrations = () => {
    router.push('/spot/spot-req?type=public'); 
  };

  const goToOwnerRegistrations = () => {
    router.push('/spot/spot-req?type=owner'); 
  };



  useEffect(()=> {
    dispatch(INIT_SPOT_LOCATION());
    dispatch(INIT_SPOT_REGISTRATIONS_OPTIONS());
  }, []);

  return (
    <Container>
     <BtnWrapper onClick={goToPrivateRegistrations}>
       <TextB1B padding='24px 0'>우리 회사•학교 신청하기</TextB1B>
     </BtnWrapper>
     <BtnWrapper onClick={goToPublicRegistrations}>
        <TextB1B padding='24px 0'>단골가게 신청하기</TextB1B>
     </BtnWrapper>
     <BtnWrapper onClick={goToOwnerRegistrations}>
       <TextB1B padding='24px 0'>우리가게 신청하기</TextB1B>
     </BtnWrapper>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 24px;
`;

const BtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${theme.greyScale25};
  margin-bottom: 15px;
  cursor: pointer;
`;

export default RegistrationsListPage;