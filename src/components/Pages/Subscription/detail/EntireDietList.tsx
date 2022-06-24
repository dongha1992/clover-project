import styled from 'styled-components';
import EntireDietItem from './EntireDietItem';

const EntireDietList = ({ list }: any) => {
  console.log('list', list);

  return (
    <Container>
      <ul>
        {list?.map((item: any, index: number) => (
          <EntireDietItem item={item} index={index} key={item.id} />
        ))}
      </ul>
    </Container>
  );
};
const Container = styled.div``;

export default EntireDietList;
