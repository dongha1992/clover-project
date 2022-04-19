import styled from 'styled-components';
import SubsManagementItem from '@components/Pages/Mypage/Subscription/SubsManagementItem';

const SubsIng = () => {
  return (
    <SubsIngContainer>
      {[1, 2, 3].map((item, index) => (
        <SubsManagementItem type="subsIng" key={index} />
      ))}
    </SubsIngContainer>
  );
};
const SubsIngContainer = styled.div``;

export default SubsIng;
