import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  theme,
  FlexBetween,
  FlexCol,
  FlexRow,
  homePadding,
  FlexBetweenStart,
  FlexColEnd,
  fixedBottom,
} from '@styles/theme';
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
import { Obj } from '@model/index';
import router from 'next/router';
import { getValues } from '@utils/common';
import { ACCESS_METHOD_PLACEHOLDER, ACCESS_METHOD, DELIVERY_TYPE_MAP } from '@constants/order';
import { IAccessMethod } from '@model/index';
import { commonSelector, INIT_ACCESS_METHOD } from '@store/common';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userForm } from '@store/user';
import { getSpotPickups } from '@api/spot';
import { spotSelector } from '@store/spot';

/*TODO: reqBody Type  */

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
}

const AddressEditPage = ({ id, spotPickupId }: IProps) => {
  const [selectedAddress, setSelectedAddress] = useState<IDestinationsResponse>();
  const [selectedAccessMethod, setSelectedAccessMethod] = useState<IAccessMethod>();
  const [isSamePerson, setIsSamePerson] = useState(true);
  const [isDefaultSpot, setIsDefaultSpot] = useState(false);
  const [deliveryEditObj, setDeliveryEditObj] = useState<IDeliveryEditObj>({
    deliveryName: '',
    receiverTel: '',
    receiverName: '',
    deliveryMessage: '',
    spotPickupId: null,
    isAccessInit: false,
  });

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { userAccessMethod } = useSelector(commonSelector);
  const { spotPickupId: selectedSpotPickupId } = useSelector(spotSelector);
  const { me } = useSelector(userForm);

  const isParcel = selectedAddress?.delivery === 'PARCEL';
  const isSpot = selectedAddress?.delivery === 'SPOT';
  const isMorning = selectedAddress?.delivery === 'MORNING';
  const isQuick = selectedAddress?.delivery === 'QUICK';

  const { data, isLoading } = useQuery(
    ['getAddressDetail'],
    async () => {
      const { data } = await getDestinationApi(id);
      return data.data;
    },
    {
      onSuccess: (data) => {
        setSelectedAddress(data);

        const isMorning = data?.delivery === 'MORNING';

        if (isMorning) {
          const userSelectMethod = getValues(data, 'deliveryMessageType');
          const selectedMethod = ACCESS_METHOD.find((item) => item.value === userSelectMethod);
          setSelectedAccessMethod(selectedMethod);
        }

        setDeliveryEditObj({
          ...deliveryEditObj,
          deliveryName: data?.name!,
          receiverTel: data?.receiverTel!,
          receiverName: data?.receiverName!,
          deliveryMessage: data?.deliveryMessage!,
          spotPickupId: data?.spotPickup?.id!,
        });
      },
      onSettled: async () => {},

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
      onSuccess: (data) => {
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
        router.push('/mypage/address');
        await queryClient.refetchQueries('getDestinationList');
      },
      onError: async (error: any) => {},
    }
  );

  const { mutateAsync: mutationEditAddress } = useMutation(
    async () => {
      const hasAccessMethod = selectedAccessMethod?.value!;
      const reqBody = {
        delivery: selectedAddress?.delivery!,
        deliveryMessage: deliveryEditObj?.deliveryMessage ? deliveryEditObj?.deliveryMessage : null,
        deliveryMessageType: hasAccessMethod ? selectedAccessMethod?.value! : null,
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
            alertMessage: '내용을 수정했어요!',
            submitBtnText: '확인',
            onSubmit: () => {
              router.push('/mypage/address');
            },
          })
        );
      },
      onError: async (error: any) => {},
    }
  );

  const checkSamePerson = () => {
    setIsSamePerson((prev) => !prev);
  };

  const checkDefaultSpot = () => {
    setIsDefaultSpot(!isDefaultSpot);
  };

  const removeAddressHandler = () => {
    if (selectedAddress?.main) {
      return dispatch(
        SET_ALERT({
          alertMessage: isSpot
            ? '기본 프코스팟은 삭제할 수 없어요. 먼저 기본 프코스팟을 변경해 주세요!'
            : '기본 배송지는 삭제할 수 없어요. 먼저 기본 배송지를 변경해 주세요!',
          submitBtnText: '확인',
        })
      );
    }

    dispatch(
      SET_ALERT({
        alertMessage: isSpot ? '프코스팟을 삭제하시겠어요?' : '배송지를 삭제하시겠어요?',
        onSubmit: () => mutationDeleteAddress(),
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };

  const cheekBeforeEdit = (): boolean => {
    const noAccessMethod = !selectedAccessMethod?.value!;

    switch (true) {
      case isMorning: {
        const noMsg = !deliveryEditObj.deliveryMessage.length;
        if (noMsg) {
          dispatch(SET_ALERT({ alertMessage: '메시지를 입력해주세요.' }));
          return false;
        } else if (noAccessMethod) {
          dispatch(SET_ALERT({ alertMessage: '츨입방법을 입력해주세요' }));
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
    setDeliveryEditObj({ ...deliveryEditObj, deliveryMessage: '', isAccessInit: !deliveryEditObj.isAccessInit });
    dispatch(INIT_ACCESS_METHOD());
    setSelectedAccessMethod(undefined);
  };

  const selectAccessMethodHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <AccessMethodSheet userAccessMethod={userAccessMethod} />,
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
    setSelectedAccessMethod(userAccessMethod);
  }, [userAccessMethod]);

  useEffect(() => {
    setDeliveryEditObj({
      ...deliveryEditObj,
      spotPickupId: selectedSpotPickupId,
    });
  }, [selectedSpotPickupId]);

  useEffect(() => {
    if (data) {
      const { receiverName, receiverTel } = data!;

      setDeliveryEditObj({
        ...deliveryEditObj,
        receiverName,
        receiverTel,
      });
    }
  }, [isSamePerson]);

  if (isLoading) {
    return <div>로딩중</div>;
  }
  return (
    <Container>
      <Wrapper>
        <ReceiverInfoWrapper>
          <FlexBetween>
            <TextH4B>받는 사람 정보</TextH4B>
            <FlexRow>
              <Checkbox onChange={checkSamePerson} isSelected={isSamePerson} />
              <TextB2R padding="0 0 0 8px">주문자와 동일</TextB2R>
            </FlexRow>
          </FlexBetween>
          <FlexCol padding="24px 0">
            <TextH5B padding="0 0 8px 0">이름</TextH5B>
            <TextInput
              placeholder="이름"
              name="receiverName"
              value={deliveryEditObj?.receiverName}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
            <TextInput
              placeholder="휴대폰 번호"
              name="receiverTel"
              value={deliveryEditObj?.receiverTel}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
        </ReceiverInfoWrapper>
        <BorderLine height={8} margin="24px 0" />
        <DevlieryInfoWrapper>
          <FlexBetween padding="0 0 24px 0">
            <TextH4B>배송정보</TextH4B>
            {isSpot && (
              <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={changePickUpPlace}>
                픽업 장소 변경
              </TextH6B>
            )}
          </FlexBetween>
          {isSpot ? (
            <FlexCol>
              <FlexBetween padding="0 0 16px 0">
                <TextH5B>배송방법</TextH5B>
                <TextB2R>{DELIVERY_TYPE_MAP[selectedAddress?.delivery!]}</TextB2R>
              </FlexBetween>
              <FlexBetweenStart>
                <TextH5B>픽업 장소</TextH5B>
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
                <TextH5B>배송방법</TextH5B>
                <TextB2R>{DELIVERY_TYPE_MAP[selectedAddress?.delivery!]}</TextB2R>
              </FlexBetween>
              <FlexBetweenStart>
                <TextH5B>베송지</TextH5B>
                <FlexColEnd>
                  <TextB2R>{selectedAddress?.location?.address}</TextB2R>
                  <TextB3R color={theme.greyScale65}> {selectedAddress?.location?.addressDetail}</TextB3R>
                </FlexColEnd>
              </FlexBetweenStart>
            </FlexCol>
          )}
        </DevlieryInfoWrapper>
        <BorderLine height={8} margin="24px 0 0 0" />
        {isMorning && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>출입 방법</TextH4B>
              <FlexRow>
                <Checkbox onChange={checkAccessInit} isSelected={deliveryEditObj.isAccessInit} />
                <TextB2R padding="0 0 0 8px">입력 초기화</TextB2R>
              </FlexRow>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <AccessMethodWrapper onClick={selectAccessMethodHandler}>
                <TextB2R color={theme.greyScale45}>{selectedAccessMethod?.text || '출입방법 선택'}</TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                name="deliveryMessage"
                placeholder={
                  ACCESS_METHOD_PLACEHOLDER[selectedAccessMethod?.value!]
                    ? ACCESS_METHOD_PLACEHOLDER[selectedAccessMethod?.value!]
                    : '요청사항 입력'
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
                    반드시 확인해주세요!
                  </TextH6B>
                </FlexRow>
                <TextB3R color={theme.brandColor}>
                  공동현관 및 무인택배함 비밀번호는 조합 방식 및 순서(#,호출버튼)와 함께 자세히 기재해주세요.
                </TextB3R>
              </FlexCol>
            </MustCheckAboutDelivery>
          </VisitorAccessMethodWrapper>
        )}
        {isParcel && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>배송 메모</TextH4B>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <TextInput
                name="deliveryMessage"
                placeholder="요청사항 입력"
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
            <TextH5B padding="0 0 8px 0">배송지명</TextH5B>
            <TextInput name="deliveryName" value={deliveryEditObj?.deliveryName} eventHandler={changeInputHandler} />
          </FlexCol>
        )}
        <FlexRow padding="0 24px">
          <Checkbox onChange={checkDefaultSpot} isSelected={isDefaultSpot} />
          <TextH5B padding="2px 0 0 8px">{isSpot ? '기본 프코 스팟으로 설정' : '기본 배송지로 설정'}</TextH5B>
        </FlexRow>
      </Wrapper>
      <ButtonGroup
        rightButtonHandler={editAddressHandler}
        leftButtonHandler={removeAddressHandler}
        leftText="삭제하기"
        rightText="수정하기"
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
