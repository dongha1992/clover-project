import styled from 'styled-components';
import Lottie from "lottie-react";
import loading_spinner_Animation from '@public/images/loading_spinner.json';

interface IProps {
  width: number;
  height: number;
}
export const Spnnier = ({width, height}: IProps) => {
  return (
    <Overlay>
      <Lottie animationData={loading_spinner_Animation} style={{ width, height }} />
    </Overlay>
  );
};

const Overlay = styled.div``;

export default Spnnier;
