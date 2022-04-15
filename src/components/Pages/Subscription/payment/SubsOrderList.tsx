import { TextB2R, TextH5B } from '@components/Shared/Text';
import { FlexBetween } from '@styles/theme';
import styled from 'styled-components';

const SubsOrderList = () => {
  return (
    <SubsOrderListContainer>
      <ul>
        {[0, 1, 2].map((item) => (
          <li key={item}>
            <TextH5B padding="0 0 16px">1월 20일 (목)</TextH5B>
            <FlexBetween padding="0 0 8px">
              <TextB2R>화이트 치즈 파르팔레 샐러드 / 미디움 (M)</TextB2R>
              <TextB2R>1개</TextB2R>
            </FlexBetween>
            <FlexBetween padding="0 0 8px">
              <TextB2R>화이트 치즈 파르팔레 샐러드 / 미디움 (M)</TextB2R>
              <TextB2R>1개</TextB2R>
            </FlexBetween>
          </li>
        ))}
      </ul>
    </SubsOrderListContainer>
  );
};
const SubsOrderListContainer = styled.div`
  padding-top: 16px;
  ul {
    li {
      border-top: 1px solid #f2f2f2;
      padding: 16px 0;
      > div:last-of-type {
        padding-bottom: 0;
      }
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
`;
export default SubsOrderList;
