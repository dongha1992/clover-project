import styled from 'styled-components';
import SbsItem from '../SbsItem';

const DawnTab = () => {
  return (
    <DawnBox>
      {[1, 2, 3, 4].map((item, index) => (
        <SbsItem key={index} />
      ))}
    </DawnBox>
  );
};
const DawnBox = styled.div``;
export default DawnTab;
