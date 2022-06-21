import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextB2R, TextH4B, TextB3R, TextH6B } from '@components/Shared/Text';
import SlideToggle from '@components/Shared/SlideToggle';
import { textBody2, theme } from '@styles/theme';
import ToggleHeader from '@components/Shared/ToggleHeader';
import { IMenuFaq } from '@model/index';
interface IContents {
  description: string;
  title: string;
  isToggle: boolean;
}

interface IProps {
  menuFaq?: IMenuFaq;
}

const DetailBottomFAQ = ({ menuFaq }: IProps) => {
  const [faq, setFaq] = useState<IContents[]>();

  const setToggleHandler = (title: string) => {
    const found = faq?.map((item) => {
      if (item.title === title) {
        return { ...item, isToggle: !item.isToggle };
      }
      return { ...item, isToggle: false };
    });
    setFaq(found);
  };

  useEffect(() => {
    const editFaq = menuFaq?.contents?.map((item) => {
      return { ...item, isToggle: false };
    });
    setFaq(editFaq);
  }, [menuFaq]);

  return (
    <Container>
      {faq?.map((content: IContents, index: number) => {
        return (
          <Contents key={index}>
            <ToggleHeader setIsToggle={setToggleHandler} text={content.title} isToggle={content.isToggle} />
            <SlideToggle state={content.isToggle} duration={0.5}>
              <Content>
                {/* <TextH6B padding="0 0 12px 0">{content.title}</TextH6B> */}
                <TextB3R>{content.description}</TextB3R>
              </Content>
            </SlideToggle>
          </Contents>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const Content = styled.div`
  background-color: ${theme.greyScale3};
  padding: 24px;
  ${textBody2};
  color: ${theme.greyScale65};
  display: flex;
  flex-direction: column;
`;

const Contents = styled.div`
  margin-top: 24px;
`;
export default DetailBottomFAQ;
