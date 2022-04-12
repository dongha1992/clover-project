import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  state: Boolean;
  duration: number;
}
const SlideToggle: React.FC<IProps> = ({ children, state = false, duration = 0.5 }) => {
  const [contentDefault, setContentDefault] = useState<any>();
  const [contentH, setContentH] = useState<any>(0);
  const contentRef = useRef<any>(null);

  useEffect(() => {
    const { current } = contentRef;
    if (current !== null) {
      setContentDefault(current.offsetHeight);
      setContentH(current.offsetHeight);
    }
    state ? setContentH(contentDefault) : setContentH(0);
  }, [contentDefault, state]);

  return (
    <Container style={{ height: contentH, transition: `all ${duration}s` }}>
      <div ref={contentRef}>{children}</div>
    </Container>
  );
};

const Container = styled.div`
  height: 0;
  overflow: hidden;
`;

export default SlideToggle;
