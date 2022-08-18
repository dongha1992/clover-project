import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { FlexCenter, FlexCol, homePadding, FlexRow } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import TextInput from '@components/Shared/TextInput';
import { TextH5B } from '@components/Shared/Text';
import { editCard, deleteCard, setMainCard } from '@api/card';
import { ButtonGroup } from '@components/Shared/Button';
import dynamic from 'next/dynamic';
import { SET_ALERT } from '@store/alert';
import { useDispatch } from 'react-redux';
import router from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

const Checkbox = dynamic(() => import('@components/Shared/Checkbox'), {
  ssr: false,
});

interface IProps {
  id: number;
  orginCardName: string;
  isMain: boolean;
}

const CardEditPage = ({ id, orginCardName, isMain }: IProps) => {
  const [isMainCard, setIsMainCard] = useState<boolean>(isMain);
  const [cardName, setCardName] = useState<string>(orginCardName);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteCard } = useMutation((id: number) => deleteCard(id), {
    onSuccess: async () => {
      router.push('/mypage/card');
      await queryClient.refetchQueries('getCardList');
      await queryClient.refetchQueries('getMainCard');
    },
    onError: () => {
      dispatch(SET_ALERT({ alertMessage: '실패하였습니다.' }));
    },
  });

  const { mutateAsync: mutateEditCardAsync } = useMutation(
    async (params: { id: number; name: string }) => {
      if (isMainCard) {
        await setMainCard(id);
      }
      return editCard(params);
    },
    {
      onSuccess: async () => {
        router.push('/mypage/card');
      },
      onError: () => {
        dispatch(SET_ALERT({ alertMessage: '실패하였습니다.' }));
      },
    }
  );

  const mutateEditCard = async () => {
    const params = {
      id,
      name: cardName,
    };
    try {
      const { data } = await mutateEditCardAsync(params);
    } catch (error) {
      console.error(error);
    }
  };

  const changeCardNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCardName(value);
  };

  const removeCardHandler = async () => {
    dispatch(
      SET_ALERT({
        alertMessage: '카드를 삭제하시겠어요?',
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => mutateDeleteCard(id),
      })
    );
  };

  const editCardHandler = async () => {
    dispatch(
      SET_ALERT({
        alertMessage: '내용을 수정했습니다.',
        submitBtnText: '확인',
        onSubmit: () => mutateEditCard(),
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
        <TextInput value={orginCardName} eventHandler={changeCardNameHandler} />
      </FlexCol>
      <FlexRow>
        <Checkbox isSelected={isMainCard} onChange={() => setIsMainCard(!isMainCard)} />
        <TextH5B padding="4px 0 0 8px">대표 카드로 설정</TextH5B>
      </FlexRow>
      <ButtonGroup
        leftButtonHandler={removeCardHandler}
        rightButtonHandler={editCardHandler}
        leftText="삭제하기"
        rightText="수정하기"
      />
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

export async function getServerSideProps(context: any) {
  const { id, name, isMain } = context.query;

  return {
    props: { id, orginCardName: name, isMain: isMain === 'true' },
  };
}

export default CardEditPage;
