import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
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
import { IMAGE_S3_DEV_URL } from '@constants/mock';
import { Button } from '@components/Shared/Button';
import Image from '@components/Shared/Image';

const RegistrationsListPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoginSuccess } = useSelector(userForm);
  const [info, setInfo] = useState<ISpotsInfo>();

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

  const spotJoinPopUp = () => {
    dispatch(
      SET_ALERT({
        alertMessage: `이미 진행 중인 신청이 있어요!\n완료 후 새롭게 신청해 주세요.`,
        submitBtnText: '확인',
      })
    );
  };

  const goToRegistration = (type: string) => {
    switch(type) {
      case 'PRIVATE':
        //canPrivateSpotRegistration 진행중이 1개 미만인경우(0개) true - 신청 가능한 상태, fasle 신청 불가능
        //비회원인 경우 null - 신청 불가능
        if ((info?.canPrivateSpotRegistration === null) || info?.canPrivateSpotRegistration) {
          return (
            router.push(`/spot/join/main?type=${type}`)
          );
        } else {
          return (
            spotJoinPopUp()
          );
        };
      case 'PUBLIC': 
      //canPublicSpotRegistraion 진행중이 3개 미만인경우 true (0~2개)
      if ((info?.canPublicSpotRegistraion === null) || info?.canPublicSpotRegistraion) {
        return (
          router.push(`/spot/join/main?type=${type}`)
        );
      } else {
        return (
          spotJoinPopUp()
        );
      };
      case 'OWNER':
        // canOwnerSpotRegistraion 진행중이 1개 미만인경우 true (0개)
        if ((info?.canOwnerSpotRegistraion === null) || info?.canOwnerSpotRegistraion) {
          return (
            router.push(`/spot/join/main?type=${type}`)
          );
        } else {
          return (
            spotJoinPopUp()
          );
      };
    };
  };

  return (
    <Container>
      <ImgWrapper>
        <Image src="/img_detail_fco_add.png"></Image>
      </ImgWrapper>
      <BtnWrapper onClick={() =>goToRegistration('PRIVATE')}>
        <Button margin="24px 0 24px 0" border color={theme.black} backgroundColor={theme.white}>
          우리 회사•학교 신청하기
        </Button>
      </BtnWrapper>
      <BtnWrapper onClick={() => goToRegistration('PUBLIC')}>
        <Button margin="24px 0 24px 0" border color={theme.black} backgroundColor={theme.white}>
          단골가게 신청하기
        </Button>
      </BtnWrapper>
      <BtnWrapper onClick={() => goToRegistration('OWNER')}>
        <Button margin="24px 0 24px 0" border color={theme.black} backgroundColor={theme.white}>
          우리가게 신청하기
        </Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
`;

const ImgWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const BacngroundImg = styled.img`
  width: 100%;
  height: 100%;
`;

const BtnWrapper = styled.div`
  width: 100%;
  cursor: pointer;
  padding: 0 24px;
`;

export default RegistrationsListPage;