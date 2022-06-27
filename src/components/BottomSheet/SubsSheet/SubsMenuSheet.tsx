import { TextB2R, TextH4B } from '@components/Shared/Text';
import { Obj } from '@model/index';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { fixedBottom, FlexCenter, FlexRow, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CloseBtn, Container, Header } from './SubsDeliveryDateChangeSheet';

interface IProps {
  type: string; // required , select
  buttonType: string;
  selectId?: number;
}

const RequiredOptionList = dynamic(() => import('@components/Pages/Subscription/register/RequiredOptionList'));
const SelectOptionList = dynamic(() => import('@components/Pages/Subscription/register/SelectOptionList'));

const SubsMenuSheet = ({ type, buttonType, selectId }: IProps) => {
  const mapper: Obj = {
    required: { title: '필수옵션 변경', text: '메뉴를 변경하면 할인금액이 변경될 수 있습니다.' },
    select: { title: '선택옵션 추가', text: '선택옵션 추가 상품은 선택한 날짜에만 추가됩니다.' },
  };

  const dispatch = useDispatch();
  return (
    <Container>
      <Header>
        <TextH4B>{mapper[type].title}</TextH4B>
        <CloseBtn
          onClick={() => {
            dispatch(INIT_BOTTOM_SHEET());
          }}
        >
          <SVGIcon name="defaultCancel24" />
        </CloseBtn>
      </Header>
      <FlexRow padding="16px 24px 8px">
        <SVGIcon name="exclamationMark" />
        <TextB2R margin="2px 0 0 4px" color="#35AD73">
          {mapper[type].text}
        </TextB2R>
      </FlexRow>
      {type === 'required' && <RequiredOptionList selectId={selectId!} />}
      {type === 'select' && <SelectOptionList buttonType={buttonType} selectId={selectId} />}
    </Container>
  );
};

export default SubsMenuSheet;
