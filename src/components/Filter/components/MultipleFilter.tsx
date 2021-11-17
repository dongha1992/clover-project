import React from 'react';
import { TextH5B } from '@components/Text';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import Checkbox from '@components/Checkbox';

type TProps = {
  title: string;
  data: any;
  changeHandler: React.MouseEventHandler<HTMLElement>;
};

function MultipleFilter({ title, data, changeHandler }: TProps) {
  return (
    <Container>
      <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
        {title}
      </TextH5B>
      <BtnContainer>
        {data &&
          data.map((item: any, index: number) => (
            <Checkbox item={item} onChange={changeHandler} key={index} />
          ))}
      </BtnContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const BtnContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

export default React.memo(MultipleFilter);
