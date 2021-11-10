import type { NextPage } from 'next';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';

const index: NextPage = () => {
  return (
    <Container>
      <Home />
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default index;
