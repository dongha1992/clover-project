import React from 'react';
import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { Obj } from '@model/index';
import { getHolidayByMenu } from '@utils/menu';
interface IProps {
  message: string;
}

const InfoMessage = ({ message }: IProps) => {
  return (
    <Container>
      <div>
        <SVGIcon name="exclamationMark" />
      </div>
      <TextB3R padding="1px 0 0 1px" color={theme.brandColor}>
        {message}
      </TextB3R>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;

  > div {
    align-self: flex-start;
  }
`;

export default React.memo(InfoMessage);
