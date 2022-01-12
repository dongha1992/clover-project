import React from 'react';
import styled from 'styled-components';
import { theme, FlexStart, FlexBetween } from '@styles/theme';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import SVGIcon from '@utils/SVGIcon';

const SpotStatusList = ({ items, onClick }: any) => {
  return (
    <Container>
      {items.map((item: any) => {
        return (
          <>
            <Wrppaer key={item.id}>
              <FlexBetween margin="0 0 6px 0">
                <Flex>
                  <TextH5B color={theme.brandColor} margin="0 8px 0 0">
                    {item.status}
                  </TextH5B>
                  <Tag
                    color={theme.brandColor}
                    backgroundColor={theme.brandColor5}
                  >
                    {item.tag}
                  </Tag>
                </Flex>

                <TextH6B
                  color={theme.greyScale65}
                  textDecoration="underline"
                  pointer
                  onClick={onClick}
                >
                  신청상세 보기
                </TextH6B>
              </FlexBetween>
              <TextH5B>{item.storeName}</TextH5B>
              <TextB3R>{item.address}</TextB3R>
              {item.number !== null && (
                <FlexStart margin="4px 0 0 0">
                  <SVGIcon name="people" />
                  <TextH6B
                    margin="0 0 0 6px"
                    color={theme.brandColor}
                  >{`${item.number}/5명 참여 중`}</TextH6B>
                </FlexStart>
              )}
              {item.btn !== null && (
                <Button
                  border
                  color={theme.black}
                  backgroundColor={theme.white}
                  margin="16px 0 0 0"
                >
                  {item.btn}
                </Button>
              )}
            </Wrppaer>
            <Row />
          </>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding-top: 70px;
`;

const Wrppaer = styled.div``;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Row = styled.div`
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 24px 0;
  &: last-child {
    border: none;
  }
`;

export default SpotStatusList;
