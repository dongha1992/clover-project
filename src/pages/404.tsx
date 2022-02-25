import styled from 'styled-components';

function Error(statusCode: string): JSX.Element {
  console.log(statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client');

  return (
    <ErrorContainer>
      <Wrapper>
        <div>error</div>
      </Wrapper>
    </ErrorContainer>
  );
}

export default Error;

const ErrorContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Wrapper = styled.div``;
