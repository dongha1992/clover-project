import React, { useState } from 'react';
import styled from 'styled-components';
import { TextH2B, TextB1B, TextH5B, TextB2R } from '@components/Shared/Text';
import { theme, homePadding, fixedBottom, FlexBetween } from '@styles/theme';
import { useRouter } from 'next/router';
import { Button } from '@components/Shared/Button';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { postSpotsRegistrationsInfoSubmit } from '@api/spot';
import { IGetRegistrationStatus } from '@model/index';
import { useDispatch } from 'react-redux';
import { SET_SPOT_REGISTRATIONS_POST_RESULT } from '@store/spot';
import { Loading } from '@components/Shared/Loading';
import { show, hide } from '@store/loading';

const SubmitPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const { spotLocation, spotsRegistrationOptions, spotsRegistrationInfo } = useSelector(spotSelector);
  const { type } = router.query;

  const registrationsSubmitHandeler = async () => {
    dispatch(show());
    setIsLoadingSubmit(true);
    const params: IGetRegistrationStatus = {
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
      type: type?.toString().toUpperCase(),
      userName: spotsRegistrationInfo.userName,
      userEmail: spotsRegistrationInfo.userEmail,
      userTel: spotsRegistrationInfo.userTel,
      placeName: spotsRegistrationInfo.placeName,
      pickupType: spotsRegistrationInfo.pickupLocation,
      lunchTime: spotsRegistrationOptions.lunchTimeOptions.value,
      placeType: spotsRegistrationOptions.placeTypeOptions.value,
      placeTypeDetail:
        spotsRegistrationOptions.placeTypeOptions?.value === 'ETC' ? spotsRegistrationInfo.placeTypeEtc : null,
      userPosition: type === 'OWNER' ? spotsRegistrationInfo.managerInfo : null,
    };
    try {
      const { data } = await postSpotsRegistrationsInfoSubmit(params);
      if (data.code === 200) {
        setIsLoadingSubmit(false);
        dispatch(hide());
        dispatch(SET_SPOT_REGISTRATIONS_POST_RESULT(data?.data));
        router.push({
          pathname: '/spot/join/main/form/submit/finish',
          query: { type },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoadingSubmit) {
    return <Loading />
  };

  return (
    <Container>
      <Wrapper>
        <TextH2B padding='24px 0 48px 0'>{'?????? ?????? ???\n????????? ????????????'}</TextH2B>
        <ContentWrapper>
          <FlexBetween margin="0 0 24px 0">
            <TextB1B>?????? ??????</TextB1B>
          </FlexBetween>
          <Content>
            <TextH5B margin="0 0 8px 0">??????</TextH5B>
            <TextB2R>{`${spotLocation.address} ${spotLocation.bdNm} ${spotLocation.addressDetail}`}</TextB2R>
          </Content>
          <Content>
            <TextH5B margin="0 0 8px 0">{`${type === 'PRIVATE' ? '?????????' : '?????????'}`}</TextH5B>
            <TextB2R>{spotsRegistrationInfo.placeName}</TextB2R>
          </Content>
          {type === 'PRIVATE' && (
            <Content>
              <TextH5B margin="0 0 8px 0">?????? ??????</TextH5B>
              <TextB2R>
                {spotsRegistrationInfo.pickupLocation}
              </TextB2R>
            </Content>
          )}
          <Content>
            <TextH5B margin="0 0 8px 0">?????? ??????</TextH5B>
            <TextB2R>
              {spotsRegistrationOptions.placeTypeOptions.name?.length &&
              spotsRegistrationOptions.placeTypeOptions.value !== 'ETC'
                ? spotsRegistrationOptions.placeTypeOptions.name
                : `?????? / ${spotsRegistrationInfo.placeTypeEtc}`}
            </TextB2R>
          </Content>
          {type === 'PRIVATE' && (
            <Content>
              <TextH5B margin="0 0 8px 0">????????????</TextH5B>
              <TextB2R>
                {spotsRegistrationOptions.lunchTimeOptions.name?.length &&
                  spotsRegistrationOptions.lunchTimeOptions.name}
              </TextB2R>
            </Content>
          )}
        </ContentWrapper>
      </Wrapper>
      {
        type !== 'PUBLIC' && <Row />
      }
      <Wrapper>
        {type !== 'PUBLIC' && (
          <>
            <ContentWrapper>
              <FlexBetween margin="0 0 24px 0">
                <TextB1B>{type === 'PRIVATE' ? '????????? ??????' : '?????? ????????? ??????'}</TextB1B>
              </FlexBetween>
              <Content>
                <TextH5B margin="0 0 8px 0">??????</TextH5B>
                <TextB2R>{spotsRegistrationInfo.userName}</TextB2R>
              </Content>
              <Content>
                <TextH5B margin="0 0 8px 0">?????????</TextH5B>
                <TextB2R>{spotsRegistrationInfo.userEmail}</TextB2R>
              </Content>
              <Content>
                <TextH5B margin="0 0 8px 0">????????? ??????</TextH5B>
                <TextB2R>{spotsRegistrationInfo.userTel}</TextB2R>
              </Content>
              {type === 'OWNER' && (
                <Content>
                  <TextH5B margin="0 0 8px 0">??????/??????</TextH5B>
                  <TextB2R>{spotsRegistrationInfo.managerInfo}</TextB2R>
                </Content>
              )}
            </ContentWrapper>
          </>
        )}
        <FixedButton onClick={registrationsSubmitHandeler}>
          <Button borderRadius="0" padding="10px 0 0 0">
            ????????? ????????????
          </Button>
        </FixedButton>
      </Wrapper>
    </Container>
  );
};

const Container = styled.main`
  padding-bottom: 56px;
`;

const Wrapper = styled.div`
  ${homePadding}
  padding-bottom: 10px;
`;

const ContentWrapper = styled.section``;

const Content = styled.div`
  margin-bottom: 24px;
`;

const FixedButton = styled.section`
  ${fixedBottom}
`;

const Row = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.greyScale6};
  margin-bottom: 32px;
`;

export default SubmitPage;
