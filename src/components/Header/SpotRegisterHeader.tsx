import React from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B, TextH5B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import { useSelector} from 'react-redux';
import { spotSelector } from '@store/spot';
import { putSpotsRegistrations } from '@api/spot';
import { IEditRegistration } from '@model/index';

interface IProps {
  title?: string;
};

const SpotRegisterHeader = ({ title }: IProps) => {
  const { spotLocation, spotsRegistrationInfo, spotsRegistrationOptions } = useSelector(spotSelector);
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;
  const adressLen = spotLocation.address?.length;

  const goBack = (): void => {
    router.back();
  };

  const putRegistrationsFetch = async() => {
    const params: IEditRegistration = {
      coordinate: {
        lat: Number(spotLocation.lat),
        lon: Number(spotLocation.lon),
      },
      location: {
        address: spotLocation.address,
        addressDetail: spotLocation.addressDetail,
        dong: spotLocation.dong,
        zipCode: spotLocation.zipCode,
      },
      userName: '플린',
      userEmail: 'flynn@freshcode.me',
      userTel: '01012341234',
      placeName: spotsRegistrationInfo.placeName,
      type: type?.toUpperCase(),
    };
    try{
      const { data } = await putSpotsRegistrations(params);
    }catch(err){
      console.error(err);
    };  
  };

  const clickTemporarySave = (): void => {
    const TitleMsg = !adressLen ? `주소/장소명(상호명)을 입력해야\n임시저장 기능을 사용할 수 있어요!` : `필수 정보를 모두 입력해야\n신청이 완료됩니다.` ;
    const SubMsg = !adressLen ? '' :`[마이페이지>스팟 관리]에서\n업데이트할 수 있어요.`;
    if(adressLen && spotsRegistrationInfo.placeName?.length){
      dispatch(
        setAlert({
          alertMessage: TitleMsg,
          alertSubMessage: SubMsg,
          submitBtnText: '확인',
          closeBtnText: '취소',
        })
      );  
    }else {
      dispatch(
        setAlert({
          alertMessage: TitleMsg,
          alertSubMessage: SubMsg,
          // onSubmit: () => {putRegistrationsFetch()},
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
        <TextH4B margin='0 0 0 23px'>{title}</TextH4B>
        <TextH5B onClick={clickTemporarySave} pointer>임시저장</TextH5B>
      </Wrapper>
    </Container>
  );
}

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
