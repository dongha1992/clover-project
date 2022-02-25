import React from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { TextH5B } from '@components/Shared/Text';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import BorderLine from '@components/Shared/BorderLine';
import { useToast } from '@hooks/useToast';

interface IProps {
  title: string;
  copiedValue: string;
}

const DATA = [
  { id: 1, text: '배송 조회하기', value: 'deliveryCheck' },
  { id: 2, text: '복사하기', value: 'copy' },
];

const DeliveryInfoSheet = ({ title, copiedValue }: IProps) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const clickTextHandler = (id: number) => {
    if (id === 1) {
    } else {
      dispatch(INIT_BOTTOM_SHEET());
      const clipboard = navigator.clipboard;
      clipboard.writeText(copiedValue).then(() => {
        showToast({
          message: '복사되었습니다.',
        });
      });
    }
  };

  const submitHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {title}
        </TextH5B>
        {DATA.map((item: any, index: number) => {
          const isLast = DATA.length - 1 === index;
          return (
            <div key={index}>
              <ItemWrapper onClick={() => clickTextHandler(item.id)}>
                <TextH5B padding="0 0 0 8px">{item.text}</TextH5B>
              </ItemWrapper>
              {!isLast && <BorderLine height={1} margin="0 0 16px 0" />}
            </div>
          );
        })}
      </Wrapper>
      <ButtonContainer onClick={() => submitHandler()}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

const ItemWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(DeliveryInfoSheet);
