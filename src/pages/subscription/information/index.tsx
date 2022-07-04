import Image from 'next/image';
import styled from 'styled-components';
import subsInfoImg from '@public/images/subsInfoImg.svg';

const InformationPage = () => {
  return (
    <Container>
      <Image src={subsInfoImg} alt="웰컴이미지" width={360} height={1430} layout="responsive" objectFit="cover" />
    </Container>
  );
};
const Container = styled.div``;
export default InformationPage;
