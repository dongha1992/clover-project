import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme, FlexBetween, FlexCol, FlexRow, homePadding, FlexBetweenStart, FlexColEnd } from '@styles/theme';
import { TextH4B, TextH5B, TextB2R, TextB3R, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import BorderLine from '@components/Shared/BorderLine';
import { ButtonGroup } from '@components/Shared/Button';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import SVGIcon from '@utils/common/SVGIcon';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { getDestinationApi, editDestinationApi, deleteDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import router from 'next/router';
import { ACCESS_METHOD_PLACEHOLDER, ACCESS_METHOD, DELIVERY_TYPE_MAP, ACCESS_METHOD_VALUE } from '@constants/order';
import { commonSelector, INIT_ACCESS_METHOD } from '@store/common';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userForm } from '@store/user';
import { getSpotPickups } from '@api/spot';
import { spotSelector } from '@store/spot';
import { pipe, indexBy } from '@fxts/core';
import { show, hide } from '@store/loading';

interface IProps {
  id: number;
  spotPickupId: number;
}

interface IDeliveryEditObj {
  deliveryName: string;
  receiverTel: string;
  receiverName: string;
  deliveryMessage: string;
  spotPickupId: number | null;
  isAccessInit: boolean;
  deliveryMessageType: string;
  selectedMethod: any;
}

const AddressEditPage = ({ id, spotPickupId }: IProps) => {
  const [selectedAddress, setSelectedAddress] = useState<IDestinationsResponse>();
  const [isSamePerson, setIsSamePerson] = useState(true);
  const [isDefaultSpot, setIsDefaultSpot] = useState(false);
  const [deliveryEditObj, setDeliveryEditObj] = useState<IDeliveryEditObj>({
    deliveryName: '',
    receiverTel: '',
    receiverName: '',
    deliveryMessage: '',
    deliveryMessageType: '',
    spotPickupId: null,
    isAccessInit: false,
    selectedMethod: null,
  });

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { userAccessMethod } = useSelector(commonSelector);
  const { spotPickupId: selectedSpotPickupId } = useSelector(spotSelector);
  const { me } = useSelector(userForm);

  const isParcel = selectedAddress?.delivery === 'PARCEL';
  const isSpot = selectedAddress?.delivery === 'SPOT';
  const isMorning = selectedAddress?.delivery === 'MORNING';

  const { data, isLoading } = useQuery(
    ['getAddressDetail'],
    async () => {
      dispatch(show());
      const { data } = await getDestinationApi(id);
      return data.data;
    },
    {
      onSuccess: data => {
        setSelectedAddress(data);

        const userAccessMethodMap = pipe(
          ACCESS_METHOD,
          indexBy(item => item.value)
        );

        setDeliveryEditObj({
          ...deliveryEditObj,
          deliveryName: data?.name!,
          receiverTel: data?.receiverTel! ?? me?.tel,
          receiverName: data?.receiverName! ?? me?.name,
          deliveryMessage: data?.deliveryMessage!,
          spotPickupId: data?.spotPickup?.id!,
          deliveryMessageType: data?.deliveryMessageType!,
          selectedMethod: userAccessMethodMap[data?.deliveryMessageType!],
        });

        me?.name !== data?.receiverName && !!data?.receiverName ? setIsSamePerson(false) : setIsSamePerson(true);
      },
      onError: async () => {
        dispatch(SET_ALERT({ alertMessage: '??? ??? ?????? ????????? ??????????????????.' }));
      },

      onSettled: () => {
        dispatch(hide());
      },

      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: pickups, refetch } = useQuery(
    'getSpotpicks',
    async () => {
      const { data } = await getSpotPickups(spotPickupId);
      return data.data.spotPickups;
    },
    {
      onSuccess: data => {
        dispatch(SET_BOTTOM_SHEET({ content: <PickupSheet pickupInfo={data!} isMypage /> }));
      },
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: mutationDeleteAddress } = useMutation(
    async () => {
      await deleteDestinationsApi(id);
    },
    {
      onSuccess: async () => {
        dispatch(INIT_ACCESS_METHOD());
        router.push({ pathname: '/mypage/address', query: { isSpot: spotPickupId ? 'true' : 'false' } });
        await queryClient.refetchQueries('getDestinationList');
      },
      onError: async (error: any) => {},
    }
  );

  const { mutateAsync: mutationEditAddress } = useMutation(
    async () => {
      const hasAccessMethod = deliveryEditObj?.selectedMethod?.value!;
      const reqBody = {
        delivery: selectedAddress?.delivery!,
        deliveryMessage: deliveryEditObj?.deliveryMessage ? deliveryEditObj?.deliveryMessage : null,
        deliveryMessageType: hasAccessMethod ? deliveryEditObj?.selectedMethod.value! : null,
        main: isDefaultSpot,
        receiverName: deliveryEditObj.receiverName,
        receiverTel: deliveryEditObj.receiverTel,
        location: selectedAddress?.location!,
        name: deliveryEditObj?.deliveryName,
        spotPickupId: deliveryEditObj?.spotPickupId,
      };
      const { data } = await editDestinationApi(id, reqBody);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getAddressDetail');
        dispatch(INIT_ACCESS_METHOD());
        dispatch(
          SET_ALERT({
            alertMessage: '????????? ???????????????!',
            submitBtnText: '??????',
            onSubmit: () => {
              router.push({
                pathname: '/mypage/address/delivery',
                query: { isSpot: spotPickupId ? 'true' : 'false' },
              });
            },
          })
        );
      },
      onError: async (error: any) => {},
    }
  );

  const checkSamePerson = () => {
    setIsSamePerson(prev => !prev);
  };

  const checkDefaultSpot = () => {
    setIsDefaultSpot(!isDefaultSpot);
  };

  const removeAddressHandler = () => {
    if (selectedAddress?.main) {
      return dispatch(
        SET_ALERT({
          alertMessage: isSpot
            ? '?????? ??????????????? ????????? ??? ?????????. ?????? ?????? ??????????????? ????????? ?????????!'
            : '?????? ???????????? ????????? ??? ?????????. ?????? ?????? ???????????? ????????? ?????????!',
          submitBtnText: '??????',
        })
      );
    }

    dispatch(
      SET_ALERT({
        alertMessage: isSpot ? '??????????????? ??????????????????????' : '???????????? ??????????????????????',
        onSubmit: () => mutationDeleteAddress(),
        submitBtnText: '??????',
        closeBtnText: '??????',
      })
    );
  };

  const cheekBeforeEdit = (): boolean => {
    if (deliveryEditObj.receiverName.length === 0 || deliveryEditObj.receiverTel.length === 0) {
      dispatch(SET_ALERT({ alertMessage: '?????? ?????? ????????? ??????????????????.' }));
      return false;
    }

    if (deliveryEditObj?.deliveryName.length === 0) {
      dispatch(SET_ALERT({ alertMessage: '??????????????? ??????????????????.' }));
      return false;
    }
    const noAccessMethod = !deliveryEditObj?.deliveryMessageType;

    switch (true) {
      case isMorning: {
        const noMsg = !deliveryEditObj?.deliveryMessage?.length;
        const isFreeAccess =
          deliveryEditObj?.deliveryMessageType === 'FREE' ||
          deliveryEditObj?.deliveryMessageType === 'DELIVERY_SECURITY_OFFICE';

        if (!isFreeAccess && noMsg) {
          dispatch(SET_ALERT({ alertMessage: '???????????? ??????????????????.' }));
          return false;
        } else if (noAccessMethod) {
          dispatch(SET_ALERT({ alertMessage: '??????????????? ??????????????????' }));
          return false;
        } else {
          return true;
        }
      }

      default: {
        return true;
      }
    }
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (isSamePerson) {
      setIsSamePerson(false);
    }

    setDeliveryEditObj({ ...deliveryEditObj, [name]: value });
  };

  const checkAccessInit = () => {
    setDeliveryEditObj({
      ...deliveryEditObj,
      deliveryMessage: '',
      deliveryMessageType: '',
      selectedMethod: null,
      isAccessInit: !deliveryEditObj.isAccessInit,
    });
    dispatch(INIT_ACCESS_METHOD());
  };

  const selectAccessMethodHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <AccessMethodSheet userAccessMethod={deliveryEditObj.selectedMethod} />,
      })
    );
  };

  const changePickUpPlace = () => {
    refetch();
  };

  const editAddressHandler = () => {
    if (cheekBeforeEdit()) {
      mutationEditAddress();
    }
  };

  useEffect(() => {
    setDeliveryEditObj({
      ...deliveryEditObj,
      spotPickupId: selectedSpotPickupId,
    });
  }, [selectedSpotPickupId]);

  useEffect(() => {
    if (isSamePerson) {
      setDeliveryEditObj({
        ...deliveryEditObj,
        receiverName: me?.name!,
        receiverTel: me?.tel!,
      });
    }
  }, [isSamePerson]);

  useEffect(() => {
    setDeliveryEditObj({
      ...deliveryEditObj,
      selectedMethod: userAccessMethod,
      deliveryMessageType: userAccessMethod?.value!,
    });
  }, [userAccessMethod]);

  useEffect(() => {
    setIsDefaultSpot(data?.main!);
  }, [data]);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Container>
      <Wrapper>
        <ReceiverInfoWrapper>
          <FlexBetween>
            <TextH4B>?????? ?????? ??????</TextH4B>
            <FlexRow>
              <Checkbox onChange={checkSamePerson} isSelected={isSamePerson} />
              <TextB2R padding="0 0 0 8px">???????????? ??????</TextB2R>
            </FlexRow>
          </FlexBetween>
          <FlexCol padding="24px 0">
            <TextH5B padding="0 0 8px 0">??????</TextH5B>
            <TextInput
              placeholder="??????"
              name="receiverName"
              value={deliveryEditObj?.receiverName ?? ''}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 8px 0">????????? ??????</TextH5B>
            <TextInput
              placeholder="????????? ??????"
              name="receiverTel"
              value={deliveryEditObj?.receiverTel ?? ''}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
        </ReceiverInfoWrapper>
        <BorderLine height={8} margin="24px 0" />
        <DevlieryInfoWrapper>
          <FlexBetween padding="0 0 24px 0">
            <TextH4B>????????????</TextH4B>
            {isSpot && (
              <TextH6B pointer color={theme.greyScale65} textDecoration="underline" onClick={changePickUpPlace}>
                ?????? ?????? ??????
              </TextH6B>
            )}
          </FlexBetween>
          {isSpot ? (
            <FlexCol>
              <FlexBetween padding="0 0 16px 0">
                <TextH5B>????????????</TextH5B>
                <TextB2R>{DELIVERY_TYPE_MAP[selectedAddress?.delivery!]}</TextB2R>
              </FlexBetween>
              <FlexBetweenStart>
                <TextH5B>?????? ??????</TextH5B>
                <FlexColEnd>
                  <TextB2R>{selectedAddress?.spotPickup?.name}</TextB2R>
                  <TextB3R color={theme.greyScale65}>
                    ({selectedAddress?.location?.zipCode}) {selectedAddress?.location?.address}
                  </TextB3R>
                </FlexColEnd>
              </FlexBetweenStart>
            </FlexCol>
          ) : (
            <FlexCol>
              <FlexBetween padding="0 0 16px 0">
                <TextH5B>????????????</TextH5B>
                <TextB2R>{DELIVERY_TYPE_MAP[selectedAddress?.delivery!]}</TextB2R>
              </FlexBetween>
              <FlexBetweenStart>
                <TextH5B>?????????</TextH5B>
                <FlexColEnd>
                  <TextB2R>{selectedAddress?.location?.address}</TextB2R>
                  <TextB2R>{selectedAddress?.location?.addressDetail}</TextB2R>
                </FlexColEnd>
              </FlexBetweenStart>
            </FlexCol>
          )}
        </DevlieryInfoWrapper>
        <BorderLine height={8} margin="24px 0 0 0" />
        {isMorning && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>?????? ??????</TextH4B>
              <FlexRow>
                <TextH6B
                  padding="0 0 0 8px"
                  onClick={checkAccessInit}
                  color={theme.greyScale65}
                  textDecoration="underLine"
                  pointer
                >
                  ?????? ?????????
                </TextH6B>
              </FlexRow>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <AccessMethodWrapper onClick={selectAccessMethodHandler}>
                <TextB2R
                  color={
                    ACCESS_METHOD_VALUE[deliveryEditObj.deliveryMessageType] ? theme.greyScale100 : theme.greyScale45
                  }
                >
                  {deliveryEditObj?.selectedMethod?.text || '???????????? ??????'}
                </TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                name="deliveryMessage"
                placeholder={
                  ACCESS_METHOD_PLACEHOLDER[deliveryEditObj.deliveryMessageType]
                    ? ACCESS_METHOD_PLACEHOLDER[deliveryEditObj.deliveryMessageType]
                    : '???????????? ??????????????????.'
                }
                margin="8px 0 0 0"
                value={deliveryEditObj?.deliveryMessage}
                eventHandler={changeInputHandler}
              />
            </FlexCol>
            <MustCheckAboutDelivery>
              <FlexCol>
                <FlexRow padding="0 0 8px 0">
                  <SVGIcon name="exclamationMark" />
                  <TextH6B padding="2px 0 0 2px" color={theme.brandColor}>
                    ????????? ??????????????????!
                  </TextH6B>
                </FlexRow>
                <TextB3R color={theme.brandColor}>
                  ???????????? ??? ??????????????? ??????????????? ?????? ?????? ??? ??????(#,????????????)??? ?????? ????????? ??????????????????.
                </TextB3R>
              </FlexCol>
            </MustCheckAboutDelivery>
          </VisitorAccessMethodWrapper>
        )}
        {isParcel && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>?????? ??????</TextH4B>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <TextInput
                name="deliveryMessage"
                placeholder="???????????? ??????"
                margin="8px 0 0 0"
                value={deliveryEditObj?.deliveryMessage}
                eventHandler={changeInputHandler}
              />
            </FlexCol>
          </VisitorAccessMethodWrapper>
        )}
        <BorderLine height={8} margin="0 0 24px 0" />
        {!isSpot && (
          <FlexCol padding="0 24px 24px 24px">
            <TextH5B padding="0 0 8px 0">????????????</TextH5B>
            <TextInput name="deliveryName" value={deliveryEditObj?.deliveryName} eventHandler={changeInputHandler} />
          </FlexCol>
        )}
        <FlexRow padding="0 24px">
          <Checkbox onChange={checkDefaultSpot} isSelected={isDefaultSpot} />
          <TextH5B padding="2px 0 0 8px">{isSpot ? '?????? ?????? ???????????? ??????' : '?????? ???????????? ??????'}</TextH5B>
        </FlexRow>
      </Wrapper>
      <ButtonGroup
        rightButtonHandler={editAddressHandler}
        leftButtonHandler={removeAddressHandler}
        leftText="????????????"
        rightText="????????????"
      />
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  margin-bottom: 70px;
  padding-top: 24px;
`;

const ReceiverInfoWrapper = styled.div`
  ${homePadding}
`;
const DevlieryInfoWrapper = styled.div`
  ${homePadding}
`;

const AccessMethodWrapper = styled.div`
  border: 1px solid ${theme.greyScale15};
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VisitorAccessMethodWrapper = styled.div`
  padding: 24px;
`;

const MustCheckAboutDelivery = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px;
  border-radius: 8px;
`;

export async function getServerSideProps(context: any) {
  const { id, spotPickupId } = context.query;

  return {
    props: { id: Number(id), spotPickupId: Number(spotPickupId) },
  };
}
export default AddressEditPage;
