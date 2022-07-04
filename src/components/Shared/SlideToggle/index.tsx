import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  state: Boolean;
  duration: number;
  change?: any;
}
const SlideToggle: React.FC<IProps> = ({ children, state = false, duration = 0.5, change }) => {
  const contentRef = useRef<any>(null);
  const contentDefaultRef = useRef();
  const [contentDefault, setContentDefault] = useState<any>();
  const [contentH, setContentH] = useState<any>(0);

  useEffect(() => {
    if (contentRef.current !== null) {
      contentDefaultRef.current = contentRef.current.offsetHeight;
      setContentH(contentRef.current.offsetHeight);
    }
    state ? setContentH(contentDefaultRef.current) : setContentH(0);
  }, [state, contentDefaultRef, contentRef, children]);

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
