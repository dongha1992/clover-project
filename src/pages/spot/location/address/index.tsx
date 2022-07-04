import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { fixedBottom, theme, FlexRow } from '@styles/theme';
import { TextH1B, TextB2R, TextB3R, TextH4B } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { DefaultKakaoMap } from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';
import TextInput from '@components/Shared/TextInput';
import { Tag } from '@components/Shared/Tag';
import { SET_SPOT_LOCATION } from '@store/spot';

const AddressDetailPage = () => {
  const { type } = router.query;
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { tempLocation } = useSelector(destinationForm);
  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });
  const [keywordLen, setKeywordLen] = useState<number>(0);

  useEffect(() => {
    getLonLanForMap();
  }, []);

  const getLonLanForMap = async () => {
    const params = {
      query: tempLocation.roadAddrPart1,
      analyze_type: 'similar',
      page: 1,
      size: 20,
    };
    try {
      const { data } = await getLonLatFromAddress(params);
      if (data.documents.length > 0) {
        const longitude = data.documents[0].x;
        const latitude = data.documents[0].y;
        setLatitudeLongitude({
          latitude,
          longitude,
        });
      } else {
        // 검색 결과가 없는 경우?
      }
    } catch (error) {}
  };

  const setSpotLocationHandler = () => {
    const addressDetail = inputRef.current?.value;
    const spotAddress = {
      addressDetail,
      address: tempLocation.roadAddrPart1,
      bdNm: tempLocation.bdNm,
      dong: tempLocation.rn,
      zipCode: tempLocation.zipNo,
      lat: latitudeLongitude.latitude,
      lon: latitudeLongitude.longitude,
      jibunAddress: tempLocation.jibunAddr,
      roadAddress: tempLocation.roadAddr,
    };

    if (!keywordLen) {
      return;
    } else {
      dispatch(SET_SPOT_LOCATION(spotAddress));
      router.replace({
        pathname: '/spot/join/main/form',
        query: { type },
      });
    }
  };

  const detailAddressInputHandler = () => {
    if (inputRef.current) {
      setKeywordLen(inputRef.current?.value.length);
    }
  };

  return (
    <Container>
      <Wrapper>
        <TextH1B padding="0 0 16px 0">프코스팟 신청이 가능해요</TextH1B>
        <TextB2R color={theme.greyScale65}>
          {'서울 및 경기도만 프코스팟 신청이 가능해요!\n(분당구 일부 지역은 담당자 확인 후, 오픈 진행됩니다.)'}
        </TextB2R>
      </Wrapper>
      <MapWrapper>
        <DefaultKakaoMap centerLat={Number(latitudeLongitude?.latitude)} centerLng={Number(latitudeLongitude?.longitude)} />
      </MapWrapper>
      <Wrapper>
        <TextH4B padding="0 0 4px 0">{tempLocation.roadAddr}</TextH4B>
        <FlexRow>
          <Tag padding="2px" width="8%" center>
            지번
          </Tag>
          <TextB2R>&nbsp;{`(${tempLocation.zipNo})${tempLocation.jibunAddr}`}</TextB2R>
        </FlexRow>
        <TextInput
          placeholder="상세주소 입력(필수)"
          margin="16px 0 0 0"
          ref={inputRef}
          eventHandler={detailAddressInputHandler}
        />
      </Wrapper>
      <ButtonWrapper>
        <Button
          height="100%"
          borderRadius="0"
          onClick={setSpotLocationHandler}
          backgroundColor={!keywordLen ? theme.greyScale6 : theme.balck}
        >
          설정하기
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Wrapper = styled.section`
  padding: 24px;
`;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

const MapWrapper = styled.div`
  height: 370px;
`;

export default AddressDetailPage;
