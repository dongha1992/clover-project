import styled from 'styled-components';
import SbsItem from '../SbsItem';

const SpotTab = () => {
  return (
    <SpotBox>
      {[1, 2, 3, 4].map((item, index) => (
        <SbsItem key={index} />
      ))}
    </SpotBox>
  );
};
const SpotBox = styled.div``;
export default SpotTab;
