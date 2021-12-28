import React, { useState } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { FlexCenter, FlexCol, homePadding, FlexRow } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import TextInput from '@components/Shared/TextInput';
import { TextH5B } from '@components/Shared/Text';
import { editCard } from '@api/card';
import { ButtonGroup } from '@components/Shared/Button/ButtonGroup';
import dynamic from 'next/dynamic';
import { setAlert } from '@store/alert';
import { useDispatch } from 'react-redux';

const Checkbox = dynamic(() => import('@components/Shared/Checkbox'), {
  ssr: false,
});

function CardEditPage() {
  const [isMainCard, setIsMainCard] = useState<boolean>(false);

  const dispatch = useDispatch();

  const changeCardNameHandler = () => {};

  const removeCard = async () => {
    dispatch(
      setAlert({
        alertMessage: '카드를 삭제하시겠어요?',
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => {},
      })
    );
  };

  const editCard = async () => {
    dispatch(
      setAlert({
        alertMessage: '내용을 수정했습니다.',
        submitBtnText: '확인',
      })
    );
  };

  return (
    <Container>
      <FlexCenter padding="32px 0 0 0">
        <SVGIcon name="cardRegister" />
      </FlexCenter>
      <BorderLine height={1} margin="32px 0" />
      <FlexCol margin="0 0 24px 0">
        <TextH5B padding="0 0 9px 0">카드 별명</TextH5B>
        <TextInput value={'별명'} eventHandler={changeCardNameHandler} />
      </FlexCol>
      <FlexRow>
        <Checkbox
          isSelected={isMainCard}
          onChange={() => setIsMainCard(!isMainCard)}
        />
        <TextH5B padding="4px 0 0 8px">대표 카드로 설정</TextH5B>
      </FlexRow>
      <ButtonGroup
        leftButtonHandler={removeCard}
        rightButtonHandler={editCard}
        leftText="삭제하기"
        rightText="수정하기"
      />
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;

export default CardEditPage;
