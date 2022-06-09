import { theme } from '@styles/theme';
import styled from 'styled-components';
import { TextH6B } from '../Text';
interface IProps {
  message: string;
}
const SubsStatusTooltip = ({ message }: IProps) => {
  return (
    <Container>
      <TextH6B margin="3px 0 0" color="#fff">
        {message}
      </TextH6B>
    </Container>
  );
};
const Container = styled.div`
  padding: 4px 8px;
  background-color: ${theme.brandColor};
  border-radius: 4px;
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
  &::after {
    content: '';
    position: absolute;
    left: 79.5px;
    bottom: -4px;
    width: 0px;
    height: 0px;
    border-top: 4px solid ${({ theme }) => theme.brandColor};
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
  }
`;
export default SubsStatusTooltip;
