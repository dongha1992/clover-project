import React, { useState } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B, TextH5B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
// import { putSpotsRegistrationsTemporary } from '@api/spot';
import { IGetRegistrationStatus } from '@model/index';

interface IProps {
  title?: string;
}

// 이번 스텝에선 빠지는 페이지 '임시저장'
// 런칭 이후에 추가될수도 있기 때문에 남겨 놓습니다.

const SpotRegisterHeader = ({ title }: IProps) => {
  const { spotLocation, spotsRegistrationInfo, spotsRegistrationOptions } = useSelector(spotSelector);
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;
  const checkAddressInfo = spotLocation.address?.length && spotsRegistrationInfo.placeName?.length;
  const [temporary, setTemporary] = useState<boolean>(false);

  const goBack = (): void => {
    router.back();
  };

  // const putRegistrationsFetch = async() => {
  //   const params: IGetRegistrationStatus = {
  //     id: null,
  //     coordinate: {
  //       lat: Number(spotLocation.lat),
  //       lon: Number(spotLocation.lon),
  //     },
  //     location: {
  //       address: spotLocation.address,
  //       addressDetail: spotLocation.addressDetail,
  //       dong: spotLocation.dong,
  //       zipCode: spotLocation.zipCode,
  //     },
  //     type: type?.toString().toUpperCase(),
  //     userName: '프코2',
  //     userEmail: 'fco2@freshcode.me',
  //     userTel: '0101222222',
  //     placeName: spotsRegistrationInfo.placeName,
  //     pickupType: spotsRegistrationOptions.pickupLocationTypeOptions.value,
  //     lunchTime: spotsRegistrationOptions.lunchTimeOptions.value,
  //     placeType: spotsRegistrationOptions.placeTypeOptions.value,
  //     placeTypeDetail: spotsRegistrationOptions.placeTypeOptions?.value === 'ETC' ? spotsRegistrationInfo.placeTypeEtc : null,
  //   };
  //   try{
  //     const { data } = await putSpotsRegistrationsTemporary(params);
  //     if(data.code === 200){
  //       setTemporary(!temporary);
  //     };
  //   }catch(err){
  //     console.error(err);
  //   };
  // };

  const clickTemporarySave = (): void => {
    const TitleMsg = !checkAddressInfo
      ? `주소/장소명(상호명)을 입력해야\n임시저장 기능을 사용할 수 있어요!`
      : `필수 정보를 모두 입력해야\n신청이 완료됩니다.`;
    const SubMsg = !checkAddressInfo ? '' : `[마이페이지>스팟 관리]에서 업데이트할 수 있어요.`;
    // 주소와 장소명을 입력해야만 임시저장이 가능함
    if (checkAddressInfo) {
      dispatch(
        SET_ALERT({
          alertMessage: TitleMsg,
          alertSubMessage: SubMsg,
          // onSubmit: () => {checkAddressInfo ? putRegistrationsFetch() : null},
          submitBtnText: '확인',
          closeBtnText: '취소',
        })
      );
    }
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B margin="0 0 0 23px">{title}</TextH4B>
        <TextH5B onClick={clickTemporarySave} pointer>
          임시저장
        </TextH5B>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: auto;
  left: calc(50%);
  background-color: white;
  z-index: 900;
  height: 56px;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 24px;
  .arrow {
    cursor: pointer;
    > svg {
    }
  }
`;

export default React.memo(SpotRegisterHeader);
