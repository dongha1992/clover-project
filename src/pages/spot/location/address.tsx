import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { fixedBottom, theme, FlexRow } from '@styles/theme';
import { TextH2B, TextB3R, TextH5B } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import MapAPI from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';
import TextInput from '@components/Shared/TextInput';
import { Tag } from '@components/Shared/Tag';
import { SET_SPOT_LOCATION } from '@store/spot';

const AddressDetailPage = () => {
  const { tempLocation } = useSelector(destinationForm);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });
  const [keywordLen, setKeywordLen] = useState<number>(0);

  const { type } = router.query;

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
    };

    if (!keywordLen) {
      return;
    } else {
      dispatch(SET_SPOT_LOCATION(spotAddress));
      router.replace({
        pathname: '/spot/register',
        query: { type },
      });
    }
  };

  const detailAddressInputHandler = () => {
    if (inputRef.current) {
      setKeywordLen(inputRef.current?.value.length);
    }
  };

  useEffect(() => {
    getLonLanForMap();
  }, []);

  return (
    <Container>
      <Wrapper>
        <TextH2B padding="0 0 16px 0">프코스팟 신청이 가능해요</TextH2B>
        <TextB3R color={theme.greyScale65}>
          {'점심•저녁 원하는 시간에 픽업 가능!\n서울 내 등록된 프코스팟에서 배송비 무료로 이용 가능해요'}
        </TextB3R>
      </Wrapper>
      <MapWrapper>
        <MapAPI centerLat={latitudeLongitude.latitude} centerLng={latitudeLongitude.longitude} />
      </MapWrapper>
      <Wrapper>
        <TextH5B padding="0 0 4px 0">{tempLocation.roadAddr}</TextH5B>
        <FlexRow>
          <Tag padding="2px" width="8%" center>
            지번
          </Tag>
          <TextB3R>&nbsp;{`(${tempLocation.zipNo})${tempLocation.jibunAddr}`}</TextB3R>
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
