import React from 'react';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

interface IProps {
  styleTags: Array<React.ReactElement<any>>;
}

class MyDocument extends Document<IProps> {
  static getInitialProps(ctx: DocumentContext): any {
    const sheet = new ServerStyleSheet();
    const page = ctx.renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }
  render() {
    return (
      <Html>
        <Head>
          {this.props.styleTags}
          <meta charSet="utf-8" />
          <link
            href="https://fonts.googleapis.com/css2?family=Alata&family=Noto+Sans+KR:wght@300;400;500&display=swap"
            rel="stylesheet"
          />
          <script
            defer
            src="https://developers.kakao.com/sdk/js/kakao.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
