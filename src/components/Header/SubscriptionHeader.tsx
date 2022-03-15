import styled from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';
import { theme } from '@styles/theme';

const SubscriptionHeader = () => {
  return (
    <Container>
      <Wrapper>
        <Button>구독안내</Button>
      </Wrapper>
    </Container>
  );
};
const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Button = styled.button`
  cursor: pointer;
  width: 59px;
  height: 26px;
  padding-top: 3px;
  justify-content: center;
  align-items: center;
  background-color: ${theme.brandColor};
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
  letter-spacing: -0.4px;
  border-radius: 24px;
`;

export default SubscriptionHeader;
