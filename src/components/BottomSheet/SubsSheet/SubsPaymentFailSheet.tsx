import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { theme } from '@styles/theme';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const SubsFailSheet = () => {
  const dispatch = useDispatch();
  return (
    <SubsFailSheetContainer>
      <BottomButton
        onClick={() => {
          dispatch(INIT_BOTTOM_SHEET());
        }}
      >
        <TextH5B>확인</TextH5B>
      </BottomButton>
    </SubsFailSheetContainer>
  );
};
const SubsFailSheetContainer = styled.div``;

const BottomButton = styled.button`
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  background-color: ${theme.black};
  color: #fff;
  &:disabled {
    background-color: ${theme.greyScale6};
    color: ${theme.greyScale25};
  }
`;

export default SubsFailSheet;
