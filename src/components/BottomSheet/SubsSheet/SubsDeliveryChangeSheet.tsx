import { RadioButton } from '@components/Shared/Button';
import { TextB2R, TextH4B, TextH5B } from '@components/Shared/Text';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { destinationForm, SET_APPLY_ALL } from '@store/destination';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { BottomButton } from './SubsDeliveryDateChangeSheet';

interface IProps {
  goToDeliverySearch: () => void;
  isCancel: boolean;
}

const DESTINATION_SELECT = [
  {
    id: 1,
    type: 'select',
    text: '선택한 회차만 변경하기',
  },
  {
    id: 2,
    type: 'all',
    text: '남은 회차 전체 변경하기',
  },
];

const SubsDeliveryChangeSheet = ({ goToDeliverySearch, isCancel }: IProps) => {
  const dispatch = useDispatch();
  const { applyAll } = useSelector(destinationForm);
  const [changeType, setChangeType] = useState(applyAll ? 'all' : 'select');

  const changeRadioHanler = (type: string) => {
    setChangeType(type);
  };

  const destinationChangeHandler = () => {
    goToDeliverySearch();
    dispatch(SET_APPLY_ALL(changeType === 'all' ? true : false));
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <TextH5B center padding="0 0 24px">
        배송지 변경
      </TextH5B>
      <RadioWrapper>
        {DESTINATION_SELECT.map((item) => {
          let isSelected;
          if (isCancel) {
            isSelected = item.type === 'all' ? true : false;
          } else {
            isSelected = changeType === item.type;
          }
          return (
            <li
              key={item.id}
              onClick={() => {
                if (isCancel) {
                  if (item.type === 'all') {
                    changeRadioHanler(item.type);
                  }
                } else {
                  changeRadioHanler(item.type);
                }
              }}
            >
              <RadioButton isSelected={isSelected} margin="0 0 2px" />
              <TextH5B
                className="textBox"
                pointer
                margin="0 0 0 8px"
                color={`${isCancel && item.type === 'select' && '#C8C8C8'}`}
              >
                {item.text}
              </TextH5B>
            </li>
          );
        })}
      </RadioWrapper>
      <BottomButton onClick={destinationChangeHandler}>
        <TextH5B>확인</TextH5B>
      </BottomButton>
    </Container>
  );
};
const Container = styled.div`
  padding: 24px;
`;
const RadioWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  li {
    display: flex;
    margin-bottom: 16px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;
export default SubsDeliveryChangeSheet;
