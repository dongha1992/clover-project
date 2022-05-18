import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme, homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { SET_SPOT_PICKUP_ID } from '@store/spot';
import Checkbox from '@components/Shared/Checkbox';
import { ISpotPickupInfo, ISpotPickupInfoInDestination } from '@model/index';

type TPrams = {
  pickupInfo?: ISpotPickupInfo[] | ISpotPickupInfoInDestination[];
  spotType?: string;
  onSubmit?: () => void;
  isMypage?: boolean;
};

const PickupSheet = ({ pickupInfo, spotType, onSubmit, isMypage }: TPrams): JSX.Element => {
  const dispatch = useDispatch();
  const [selectedPickupId, setSelectedPickupId] = useState<number>(pickupInfo![0].id);
  const [noticeChecked, setNoticeChecked] = useState<boolean>(false);

  useEffect(() => {
    dispatch(SET_SPOT_PICKUP_ID(selectedPickupId));
  }, [selectedPickupId]);

  const changeRadioHandler = (id: number) => {
    setSelectedPickupId(id);
  };

  const checkHandler = () => {
    setNoticeChecked(!noticeChecked);
  };

  const submitHandler = (): void => {
    if (spotType === 'PRIVATE') {
      if (noticeChecked) {
        onSubmit && onSubmit();
        dispatch(INIT_BOTTOM_SHEET());
      } else {
        return;
      }
    } else {
      onSubmit && onSubmit();
      dispatch(INIT_BOTTOM_SHEET());
    }
  };
  const btnText = isMypage ? '확인' : '주문하기';

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {isMypage ? '픽업 장소 변경' : '픽업 장소 선택'}
        </TextH5B>
        {pickupInfo?.map((i, index) => {
          return (
            <PickWrapper key={index}>
              <RadioButton onChange={() => changeRadioHandler(i.id)} isSelected={selectedPickupId === i.id} />
              <TextH5B padding="0 0 0 8px">{i.name}</TextH5B>
            </PickWrapper>
          );
        })}
        {spotType === 'PRIVATE' && (
          <>
            <Row />
            <CheckTerm onClick={checkHandler}>
              <Checkbox isSelected={noticeChecked} onChange={checkHandler} />
              <span className="h5B">
                <span className="brandColor">임직원 전용</span>
                스팟으로, 외부인은 이용이 불가합니다.
              </span>
            </CheckTerm>
          </>
        )}
      </Wrapper>
      <ButtonContainer onClick={submitHandler}>
        {spotType !== 'PRIVATE' ? (
          <Button height="100%" width="100%" borderRadius="0">
            {btnText}
          </Button>
        ) : noticeChecked ? (
          <Button height="100%" width="100%" borderRadius="0">
            {btnText}
          </Button>
        ) : (
          <Button disabled height="100%" width="100%" borderRadius="0">
            {btnText}
          </Button>
        )}
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;
const PickWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;
const Row = styled.div`
  width: 100%;
  border-top: 1px solid ${theme.greyScale6};
`;
const CheckTerm = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0 24px 0;
  cursor: pointer;
  .h5B {
    padding-top: 2px;
    font-size: 12px;
    letter-spacing: -0.4px;
    line-height: 18px;
    color: ${theme.greyScale65};
    .brandColor {
      color: ${theme.brandColor};
      font-weight: bold;
      padding-right: 4px;
      padding-left: 4px;
    }
  }
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(PickupSheet);
