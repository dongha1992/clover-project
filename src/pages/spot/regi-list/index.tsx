import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextB1B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { 
    INIT_SPOT_LOCATION, 
    INIT_SPOT_REGISTRATIONS_OPTIONS,
  } from '@store/spot';  
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { getSpotInfo } from '@api/spot';
import { ISpotsInfo } from '@model/index';

const RegistrationsListPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoginSuccess } = useSelector(userForm);
  const [info, setInfo] = useState<ISpotsInfo>();

  const goToRegistration = (type: string) => {
    if (isLoginSuccess) {
      if((type === 'PRIVATE' && !info?.canPrivateSpotRegistration) || (type === 'PUBLIC' && !info?.canPublicSpotRegistraion) || (type === 'OWNER' && !info?.canOwnerSpotRegistraion)) {
        return (
          dispatch(
            SET_ALERT({
              alertMessage: `이미 진행 중인 신청이 있어요!\n완료 후 새롭게 신청해 주세요.`,
              submitBtnText: '확인',
            })
          )
        )   
      } else {
        router.push(`/spot/spot-req?type=${type}`);
      }
    } else {
      dispatch(
        SET_ALERT({
          alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => router.push('/onboarding'),
        })
      );
    }
  };

  useEffect(()=> {
    dispatch(INIT_SPOT_LOCATION());
    dispatch(INIT_SPOT_REGISTRATIONS_OPTIONS());
  }, []);

  useEffect(() => {
    // 스팟 정보 조회
   const getFetch = async() => {
     try {
       const { data } = await getSpotInfo();
       setInfo(data.data);
     } catch (err) {
       console.error(err);
     }
   };

   getFetch();
 }, [])


  return (
    <Container>
     <BtnWrapper onClick={() =>goToRegistration('PRIVATE')}>
       <TextB1B padding='24px 0'>우리 회사•학교 신청하기</TextB1B>
     </BtnWrapper>
     <BtnWrapper onClick={() => goToRegistration('PUBLIC')}>
        <TextB1B padding='24px 0'>단골가게 신청하기</TextB1B>
     </BtnWrapper>
     <BtnWrapper onClick={() => goToRegistration('OWNER')}>
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