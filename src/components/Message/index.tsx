import { TextB3R } from '@components/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';

export const InfoMessage = ({ message = 'default' }): any => {
  return (
    <Container>
      <SVGIcon name="exclamationMark" />
      <MessageWrapper>
        <TextB3R padding="4px 0 0 4px" color={theme.brandColor}>
          {message}
        </TextB3R>
      </MessageWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const MessageWrapper = styled.div``;
