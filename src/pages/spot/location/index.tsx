import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { HomeContainer, FlexRow, FlexRowStart, theme } from '@styles/theme';
import { TextH6B, TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { searchAddressJuso } from '@api/search';
import { getAddressFromLonLat } from '@api/location';
import { IJuso } from '@model/index';
import AddressItem from '@components/Pages/Location/AddressItem';
import { SET_LOCATION_TEMP } from '@store/destination';
import { SPECIAL_REGX, ADDRESS_KEYWORD_REGX } from '@constants/regex/index';
import { Tag } from '@components/Shared/Tag';
import { getAvailabilityDestinationApi } from '@api/destination';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';
import { getRegistrationSearch } from '@api/spot';
import { ISpotsDetail } from '@model/index';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SpotRegisterSheet } from '@components/BottomSheet/SpotRegisterSheet';
import { userForm } from '@store/user';
import { SpotAddressDetailFormSheet } from '@components/BottomSheet/SpotAddressDetailFormSheet';

/* TODO: geolocation 에러케이스 추가 */

const LocationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;
  const { me } = useSelector(userForm);
  const addressRef = useRef<HTMLInputElement>(null);
  const [resultAddress, setResultAddress] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');
  const [isSearched, setIsSearched] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>();
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [spotRegistration, setSpotRegistration] = useState<ISpotsDetail[]>([]);

  const userId = Number(me?.id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
      if (Math.round(scrollTop + clientHeight) >= scrollHeight) {
        // 페이지 끝에 도달하면 page 파라미터 값에 +1 주고, 데이터 받아온다.
        setPage((prevPage) => prevPage + 1);
      }
    };
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSearchAddressResult();
  }, [page]);


  const setCurrentLoc = (location: string) => {
    const locationInfoMsg = `${location}(으)로
    설정되었습니다.`;
    dispatch(
      SET_ALERT({
        alertMessage: locationInfoMsg,
        onSubmit: () => {},
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { data } = await getAddressFromLonLat({
          y: position.coords.latitude?.toString(),
          x: position.coords.longitude?.toString(),
        });
        setUserLocation(data.documents[0].address_name);
        setCurrentLoc(data.documents[0].address_name);
      });
    }
  };

  const addressInputHandler = () => {
    setKeyword(addressRef.current?.value);
    const keyword = addressRef.current?.value.length;
    setIsTyping(true);
    if (addressRef.current) {
      if (!keyword) {
        setResultAddress([]);
        setIsSearched(false);
        clearInputHandler();
      }
    }
  };

  const getSearchAddressResult = async () => {
    if (addressRef.current) {
      let query = addressRef.current?.value;
      
      const params = {
        query,
        page: page,
      };
      try {
        let { data } = await searchAddressJuso(params);

        const list = data?.results.juso ?? [];
        setResultAddress((prevList) => [...prevList, ...list]);
        setTotalCount(data.results.common.totalCount);
        setIsSearched(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getSearchAddress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setResultAddress([]);
      getSearchAddressResult();
    }
  };

  const clearInputHandler = () => {
    if (addressRef.current) {
      addressRef.current.value = '';
    }
    setIsTyping(false);
  };

  const alertNoSpotRecruiting = () => {
    dispatch(
      SET_ALERT({
        alertMessage: '신청했던 주소는 재신청할 수 없어요.',
        alertSubMessage: '(트라이얼 재신청은 프코스팟 관리 >\n신청 현황에서 할 수 있어요.)',
        submitBtnText: '확인',
      })
    );
  };

  const checkAvailableDeliverySpots = async (i: IJuso) => {
    const params = {
      jibunAddress: i.jibunAddr,
      roadAddress: i.roadAddr,
      zipCode: i.zipNo,
      delivery: null,
    };
    try {
      const { data } = await getAvailabilityDestinationApi(params);
      if (data.code === 200) {
        const result = data.data?.spot;
        if (result === false) {
          // 해당 주소에 스팟 신청이 불가능할 경우
          dispatch(
            SET_ALERT({
              alertMessage: '서울 및 경기도(일부 지역 해당)만\n프코스팟 오픈 신청이 가능해요!',
              submitBtnText: '확인',
            })
          );
          return;
        }
        dispatch(
          SET_BOTTOM_SHEET({
            content: (
              <SpotAddressDetailFormSheet
                title="주소 검색"
              />
            ),
            height: '100vh'
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSpotRegistrationSearch = async (i: IJuso) => {
    const params = {
      address: i?.roadAddrPart1,
    };
    try {
      const { data } = await getRegistrationSearch(params);
      setSpotRegistration(data.data.spotRegistrations);

      // query type 으로 각 타입별 스팟 신청 목록 선택
      const findRegisterList = data.data.spotRegistrations.find((i) => i.type === type);
      // 스팟 신청 중인 목록이 존재 하고, 신청 타입이 신청 목록의 타입과 같은 경우
      if (data.data.spotRegistrations.length > 0 && !!findRegisterList) {
        switch (type) {
          case 'PRIVATE':
            // 오픈 미진행된 스팟인 경우 true
            if (findRegisterList?.rejected) {
              // 동일 유저
              if (findRegisterList?.userId === userId) {
                return alertNoSpotRecruiting(); // 오픈 미진행된 스팟을 동일한 유저가 선택한 경우
              } else {
                return checkAvailableDeliverySpots(i); // 동일 유저 아닐 경우, 스팟 신청 다음 플로우로 이동
              };
            } else {
              // 해당 타입에 스팟 신청 중인 목록이 존재할 경우
              if (!!findRegisterList) {
                return dispatch(
                  SET_BOTTOM_SHEET({
                    content: <SpotRegisterSheet items={findRegisterList} type={'PRIVATE'} />,
                  })
                );    
              } else {
                // 존재하지 않을 경우, 스팟 신청 다음 플로우로 이동
                return checkAvailableDeliverySpots(i);
              };
            };
          case 'PUBLIC':
            if (findRegisterList?.rejected) {
              if (findRegisterList?.userId === userId) {
                return alertNoSpotRecruiting();
              };
            } else {
              if (!!findRegisterList) {
                if(findRegisterList.recruited){
                  return dispatch(
                    SET_BOTTOM_SHEET({
                      content: <SpotRegisterSheet items={findRegisterList} type={'PUBLIC'} recruited />,
                    })
                  );  
                } else {
                  return dispatch(
                    SET_BOTTOM_SHEET({
                      content: <SpotRegisterSheet items={findRegisterList} type={'PUBLIC'} />,
                    })
                  );  
                }
              } else {
                return checkAvailableDeliverySpots(i);
              };
            };
          case 'OWNER':
            if (findRegisterList.rejected) {
              if (findRegisterList?.userId === userId) {
                return alertNoSpotRecruiting();
              } else {
                return checkAvailableDeliverySpots(i);
              }
            } else {
              if (!!findRegisterList) {
                return dispatch(
                  SET_ALERT({
                    alertMessage: '해당 주소에 이미 신청 중인\n프코스팟이 있어요!',
                    submitBtnText: '확인',
                  })
                );  
              } else {
                return checkAvailableDeliverySpots(i);
              };
            };
        };
      } else {
        // 스팟 신청 중인 목록이 존재하지 않는 경우, 스팟 신청 다음 플로우로 이동
        checkAvailableDeliverySpots(i);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const goToSpotRegisterationDetailInfo = (i: IJuso): void => {
    dispatch(SET_LOCATION_TEMP(i));
    getSpotRegistrationSearch(i);
  };

  return (
    <HomeContainer>
      <Wrapper>
        <TextInput
          name="input"
          placeholder="도로명, 건물명 또는 지번으로 검색"
          inputType="text"
          svg="searchIcon"
          eventHandler={addressInputHandler}
          keyPressHandler={getSearchAddress}
          ref={addressRef}
        />
        <CurrentLocBtn>
          <SVGIcon name="locationBlack" />
          <TextH6B pointer padding="0 0 0 4px" onClick={getGeoLocation}>
            현 위치로 설정하기
          </TextH6B>
        </CurrentLocBtn>
        <ResultList>
          {resultAddress.length > 0 && (
            <>
              <TextH5B padding="0 0 17px 0">검색 결과 {totalCount}개</TextH5B>
              <CaseWrapper>
                <FlexRow width="100%">
                  <TextH6B>도로명주소 + 건물명</TextH6B>
                </FlexRow>
                <FlexRowStart padding="4px 0 0 0">
                  <Tag padding="2px" width="8%" center>
                    지번
                  </Tag>
                  <TextB3R margin="2px 0 0 4px">(우편번호)지번주소</TextB3R>
                </FlexRowStart>
              </CaseWrapper>
              {resultAddress.map((address, index) => {
                return (
                  <AddressItem
                    key={index}
                    roadAddr={address.roadAddrPart1}
                    bdNm={address.bdNm}
                    jibunAddr={address.jibunAddr}
                    zipNo={address.zipNo}
                    onClick={() => goToSpotRegisterationDetailInfo(address)}
                  />
                );
              })}
            </>
          )}
          {
          !resultAddress.length && 
            isSearched && (
              <NoResultWrapper>
                <TextB2R center color={theme.greyScale65}>
                {'검색 결과가 없어요. 😭\n입력한 주소를 다시 한 번 확인해 주세요.'}
                </TextB2R>
              </NoResultWrapper>
            )
          }
        </ResultList>
      </Wrapper>
    </HomeContainer>
  );
};

const Wrapper = styled.div`
  padding: 8px 0px 24px;
`;

const TextInputWrapper = styled.div`
  position: relative;
  .removeSvg {
    position: absolute;
    right: 5%;
    top: 32%;
  }
`;

const CurrentLocBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

const ResultList = styled.div``;

const CaseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const NoResultWrapper = styled.div`
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LocationPage;
