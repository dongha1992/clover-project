import styled from 'styled-components';
import { SubsItem } from '@components/Pages/Subscription';

const DawnTab = () => {
  return (
    <DawnBox>
      {[1, 2, 3, 4].map((item, index) => (
        <SubsItem key={index} item={item} />
      ))}
    </DawnBox>
  );
};
const DawnBox = styled.div``;
export default DawnTab;
