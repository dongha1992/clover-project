import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { useSelector } from 'react-redux';
import { cartForm } from '@store/cart';
import { theme } from '@styles/theme';
import { userForm } from '@store/user';
import { getCartCountApi } from '@api/cart';
import { useQuery, useQueryClient } from 'react-query';

const CartIcon = ({ onClick }: any) => {
  const { cartLists, nonMemberCartLists } = useSelector(cartForm);
  const { me } = useSelector(userForm);

  const {
    data: count,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ['getCartCount'],
    async () => {
      const { data } = await getCartCountApi();
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      enabled: !!me,
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );

  const cartCount = me ? count! : nonMemberCartLists.length!;
  const displayCount = cartCount > 9 ? '+9' : cartCount;

  return (
    <Container onClick={onClick}>
      <div className="cart">
        <SVGIcon name="cart" />
      </div>
      <CountWrapper>
        <Count> {displayCount}</Count>
      </CountWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  cursor: pointer;
`;

const CountWrapper = styled.div`
  position: absolute;
  right: -7px;
  bottom: 13px;
  width: 6px;
  height: 12px;
  background-color: ${theme.brandColor};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 10px;
`;

const Count = styled.div`
  font-weight: 700;
  line-height: 11.58px;
  letter-spacing: -0.4px;
  font-size: 8px;
  padding-top: 1px;
  color: ${theme.white};
`;

export default React.memo(CartIcon);
