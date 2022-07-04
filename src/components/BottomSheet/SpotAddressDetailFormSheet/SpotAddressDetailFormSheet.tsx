import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton, fixedBottom, theme, FlexRow } from '@styles/theme';
import { TextB2R, TextH1B, TextH4B, TextH6B, TextH5B } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { DefaultKakaoMap } from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';
import TextInput from '@components/Shared/TextInput';
import { Tag } from '@components/Shared/Tag';
import { SET_SPOT_LOCATION } from '@store/spot';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';

interface IProps {
  title: string;
}

const SpotAddressDetailFormSheet = ({title}: IProps) => {
  const { type } = router.query;
  const { tempLocation } = useSelector(destinationForm);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
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
        return;
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
      InitBottomSheet();
    }
  };

  const detailAddressInputHandler = () => {
    if (inputRef.current) {
      setKeywordLen(inputRef.current?.value.length);
    }
  };

  const InitBottomSheet = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <div className="arrow" onClick={InitBottomSheet}>
            <SVGIcon name="arrowLeft" />
          </div>
          <TextH5B padding="2px 0 0 0">
            {title}
          </TextH5B>
        </Header>
      </HeaderWrapper>
      <Wrapper>
        <TextH1B padding="0 0 16px 0">프코스팟 신청이 가능해요</TextH1B>
        <TextB2R color={theme.greyScale65}>
          {'서울 및 경기도만 프코스팟 신청이 가능해요!\n(분당구 일부 지역은 담당자 확인 후, 오픈 진행됩니다.)'}
        </TextB2R>
      </Wrapper>
      <MapWrapper>
        <DefaultKakaoMap centerLat={Number(latitudeLongitude?.latitude)} centerLng={Number(latitudeLongitude?.longitude)} />
      </MapWrapper>
      <AddressWrapper>
        <TextH4B padding="0 0 4px 0">{tempLocation.roadAddr}</TextH4B>
        <AddressDetail>
          <Tag padding="2px" width="28px" center>
            지번
          </Tag>
          <TextB2R>&nbsp;{`(${tempLocation.zipNo})${tempLocation.jibunAddr}`}</TextB2R>
        </AddressDetail>
        <TextInput
          placeholder="상세주소 입력(필수)"
          margin="16px 0 0 0"
          ref={inputRef}
          eventHandler={detailAddressInputHandler}
        />
      </AddressWrapper>
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

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 80px 24px 24px 24px;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  background-color: white;
  ${({ theme }) => theme.desktop`
  margin: 0 auto;
  left: 0;
`};

${({ theme }) => theme.mobile`
  margin: 0 auto;
  left: 0px;
`};

`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  .arrow {
    cursor: pointer;
    > svg {
      position: absolute;
      left: 24px;
      bottom: 16px;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  height: 56px;
  background-color: ${({ theme }) => theme.black};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0%;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const MapWrapper = styled.div`
  height: 370px;
`;

const AddressWrapper = styled.div`
  padding: 24px 24px 40px 24px;
`;

const AddressDetail= styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;


export default React.memo(SpotAddressDetailFormSheet);
