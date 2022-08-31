import styled from 'styled-components';
import Lottie from "lottie-react";
import loading_spinner_Animation from '@public/images/loading_spinner.json';

export const Spnnier = () => {
  return (
    <Overlay>
      <Lottie animationData={loading_spinner_Animation} style={{ width: 18, height: 18 }} />
    </Overlay>
  );
};

const Overlay = styled.div``;

export default Spnnier;
