import { SubsItem } from '@components/Pages/Subscription';
import React from 'react';
import styled from 'styled-components';

const SubscriptionDibPage = () => {
  return (
    <Container>
      {[1, 2, 3, 4].map((item, index) => (
        <SubsItem item={item} key={index} />
      ))}
    </Container>
  );
};
const Container = styled.div`
  padding: 74px 24px 26px;
`;

export default SubscriptionDibPage;
