import styled from 'styled-components';
import SubsItem from '../SubsItem';

const SpotTab = () => {
  return (
    <SpotBox>
      {[1, 2, 3, 4].map((item, index) => (
        <SubsItem item={item} key={index} />
      ))}
    </SpotBox>
  );
};
const SpotBox = styled.div``;
export default SpotTab;
