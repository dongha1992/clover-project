import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { HomeContainer, theme } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { searchAddressJuso } from '@api/search';
import { IJuso } from '@model/index';
import AddressItem from '@components/Pages/Location/AddressItem';
import { SET_LOCATION_TEMP } from '@store/destination';
import { getAvailabilityDestinationApi } from '@api/destination';
import { useSelector } from 'react-redux';
import { getRegistrationSearch } from '@api/spot';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SpotRegisterSheet } from '@components/BottomSheet/SpotRegisterSheet';
import { userForm } from '@store/user';
import { useQuery } from 'react-query';
import { Loading } from '@components/Shared/Loading';
import { show, hide } from '@store/loading';

const LocationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type, keyword }: any = router.query;
  const { me } = useSelector(userForm);
  const addressRef = useRef<HTMLInputElement>(null);
  const [resultAddress, setResultAddress] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [inputKeyword, setInputKeyword] = useState<string>('');
  const [routerQueries, setRouterQueries] = useState({});

  const userId = Number(me?.id);

  useEffect(() => {
    if (router.isReady) {
      setRouterQueries(router.query);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if(keyword) {
      startAddressSearch(keyword);
      setIsSearched(true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
      if (Math.round(scrollTop + clientHeight) >= scrollHeight) {
        // ????????? ?????? ???????????? page ???????????? ?????? +1 ??????, ????????? ????????????.
        setPage((prevPage) => prevPage + 1);
      }
    };
    // scroll event listener ??????
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener ??????
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    error,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
    ['addressResultList', page],
    async () => {
      const params = {
        query: inputKeyword,
        page: page,
      };
        dispatch(show());
        const { data } = await searchAddressJuso(params);
      return data
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!isSearched,
      onError: () => {},
      onSuccess: (data) => {
        const list = data.results.juso ?? [];
        setResultAddress((prevList) => [...prevList, ...list]);
        setTotalCount(data.results.common.totalCount);
      },
      onSettled: () => {
        dispatch(hide());
      },
    }
  );

  const getSearchAddress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if(value.length === 0) {
        setResultAddress([]);
      };
      startAddressSearch(value);
      setIsSearched(true);
      setInputKeyword(value);
      router.replace({
        query: {...routerQueries, keyword: value},
      });
    };
  };

  const startAddressSearch = (keyword: string) => {
    setInputKeyword(keyword);
    setIsSearched(true);
  };

  const changeInputHandler = (e: any) => {
    const value =  e.target.value;
    setInputKeyword(value);
    if(value.length){
      setResultAddress([]);
      setIsSearched(false);
    };
    if (!value) {
      setInputKeyword('');
    };
  };

  const clearInputHandler = () => {
    if (addressRef.current?.value.length! > 0) {
      if (addressRef.current) {
        addressRef.current.value = '';
      };
      setResultAddress([]);
      setIsSearched(false);
      setInputKeyword('');
    };
  };

  const alertNoSpotRecruiting = () => {
    dispatch(
      SET_ALERT({
        alertMessage: '???????????? ????????? ???????????? ??? ?????????.',
        alertSubMessage: '(???????????? ???????????? ???????????? ?????? >\n?????? ???????????? ??? ??? ?????????.)',
        submitBtnText: '??????',
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
          // ?????? ????????? ?????? ????????? ???????????? ??????
          dispatch(
            SET_ALERT({
              alertMessage: '?????? ??? ?????????(?????? ?????? ??????)???\n???????????? ?????? ????????? ????????????!',
              submitBtnText: '??????',
            })
          );
          return;
        }
        goToAddressDetailPage();
      };
    } catch (err) {
      dispatch(
        SET_ALERT({
          alertMessage: '??? ??? ?????? ????????? ??????????????????.\n?????? ?????? ????????? ?????????.',
          submitBtnText: '??????',
        })
      );
      console.error(err);
    };
  };

  const goToAddressDetailPage = () => {
    router.replace({
      pathname: '/spot/location/address',
      query: {
        type: type,
        keyword: inputKeyword,
      },
    });
  }

  const getSpotRegistrationSearch = async (i: IJuso) => {
    const params = {
      address: i?.roadAddrPart1,
    };
    try {
      const { data } = await getRegistrationSearch(params);

      // query type ?????? ??? ????????? ?????? ?????? ?????? ??????
      const findRegisterList = data.data.spotRegistrations.find((i) => i.type === type);
      // ?????? ?????? ?????? ????????? ?????? ??????, ?????? ????????? ?????? ????????? ????????? ?????? ??????
      if (data.data.spotRegistrations.length > 0 && !!findRegisterList) {
        switch (type) {
          case 'PRIVATE':
            // ?????? ???????????? ????????? ?????? true
            if (findRegisterList?.rejected) {
              // ?????? ??????
              if (findRegisterList?.userId === userId) {
                return alertNoSpotRecruiting(); // ?????? ???????????? ????????? ????????? ????????? ????????? ??????
              } else {
                return checkAvailableDeliverySpots(i); // ?????? ?????? ?????? ??????, ?????? ?????? ?????? ???????????? ??????
              };
            } else {
              // ?????? ????????? ?????? ?????? ?????? ????????? ????????? ??????
              if (!!findRegisterList) {
                return dispatch(
                  SET_BOTTOM_SHEET({
                    content: <SpotRegisterSheet items={findRegisterList} type={'PRIVATE'} />,
                  })
                );    
              } else {
                // ???????????? ?????? ??????, ?????? ?????? ?????? ???????????? ??????
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
                    alertMessage: '?????? ????????? ?????? ?????? ??????\n??????????????? ?????????!',
                    submitBtnText: '??????',
                  })
                );  
              } else {
                return checkAvailableDeliverySpots(i);
              };
            };
        };
      } else {
        // ?????? ?????? ?????? ????????? ???????????? ?????? ??????, ?????? ?????? ?????? ???????????? ??????
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

  if (isLoading) {
    return <Loading />;
  };

  return (
    <HomeContainer>
      <Wrapper>
        <SearchBarWrapper>
          <TextInput
            name="input"
            placeholder="?????????, ????????? ?????? ???????????? ??????"
            inputType="text"
            svg="searchIcon"
            eventHandler={changeInputHandler}
            keyPressHandler={getSearchAddress}
            ref={addressRef}
            value={inputKeyword}
          />
          {
            addressRef.current?.value && (
              <div className="removeSvg" onClick={clearInputHandler}>
                <SVGIcon name="removeItem" />
              </div>
            )
          }
        </SearchBarWrapper>
        {
          isSearched ? (
            <ResultList>
              {resultAddress.length > 0 ? (
                <>
                  <TextH5B padding="24px 0 24px 0">?????? ?????? {totalCount}???</TextH5B>
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
              ) : (
                <NoResultWrapper>
                  <TextB2R center color={theme.greyScale65}>
                  {'?????? ????????? ?????????. ????\n????????? ????????? ?????? ??? ??? ????????? ?????????.'}
                  </TextB2R>
                </NoResultWrapper>
              )
              }
            </ResultList>
          ) : (
            null
          )
        }
      </Wrapper>
    </HomeContainer>
  );
};

const Wrapper = styled.div`
  padding: 8px 0px 24px;
`;

const SearchBarWrapper = styled.div`
  position: relative;
  .removeSvg {
    position: absolute;
    right: 0;
    top: 0;
    margin: 15px 14px 0 0;
  }
`;

const ResultList = styled.div``;

const NoResultWrapper = styled.div`
  height: 40vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export default LocationPage;
