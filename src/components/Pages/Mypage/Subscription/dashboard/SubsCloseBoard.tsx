import { TextH5B } from '@components/Shared/Text';
import { FlexRow, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';

const SubsCloseBoard = () => {
  return (
    <BoardContainer>
      <FlexRow>
        <SVGIcon name="exclamationRedMark" />
        <TextH5B color={theme.systemRed}>자동 해지될 예정인 구독을 확인해 주세요!</TextH5B>
      </FlexRow>
    </BoardContainer>
  );
};
const BoardContainer = styled.div`
  background-color: #fff1f1;
  margin-top: 15px;
  border-radius: 8px;
  padding: 16px;
  b {
    color: ${theme.brandColor};
  }
  svg {
    margin-bottom: 3px;
    margin-right: 4px;
  }
`;
export default SubsCloseBoard;
