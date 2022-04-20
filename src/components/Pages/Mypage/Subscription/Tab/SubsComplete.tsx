import styled from 'styled-components';
import SubsManagementItem from '@components/Pages/Mypage/Subscription/SubsManagementItem';

const SubsComplete = () => {
  return (
    <SubsCompleteContainer>
      {[1, 2, 3].map((item, index) => (
        <SubsManagementItem type="subsComplete" key={index} />
      ))}
    </SubsCompleteContainer>
  );
};
const SubsCompleteContainer = styled.div``;

export default SubsComplete;
