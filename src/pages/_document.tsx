import React from 'react';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

interface IProps {
  styleTags: Array<React.ReactElement<any>>;
}

class MyDocument extends Document<IProps> {
  static getInitialProps(ctx: DocumentContext): any {
    const sheet = new ServerStyleSheet();
    const page = ctx.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
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
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/static/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="36x36" href="/static/android-icon-36x36" />
          <link rel="icon" type="image/png" sizes="48x48" href="/static/android-icon-48x48" />
          <link rel="icon" type="image/png" sizes="72x72" href="/static/android-icon-72x72" />
          <link rel="icon" type="image/png" sizes="96x96" href="/static/android-icon-96x96" />
          <link rel="icon" type="image/png" sizes="144x144" href="/static/android-icon-144x144" />
          <link rel="icon" type="image/png" sizes="192x192" href="/static/android-icon-192x192" />
          <link rel="icon" type="image/png" sizes="57x57" href="/static/apple-icon-57x57" />
          <link rel="icon" type="image/png" sizes="60x60" href="/static/apple-icon-60x60" />
          <link rel="icon" type="image/png" sizes="72x72" href="/static/apple-icon-72x72" />
          <link rel="icon" type="image/png" sizes="144x144" href="/static/apple-icon-144x144" />
          <link rel="icon" type="image/png" sizes="120x120" href="/static/apple-icon-120x120" />
          <link rel="icon" type="image/png" sizes="144x144" href="/static/apple-icon-144x144" />
          <link rel="icon" type="image/png" sizes="152x152" href="/static/apple-icon-152x152" />
          <link rel="icon" type="image/png" sizes="180x180" href="/static/apple-icon-180x180" />
          <link rel="icon" type="image/png" href="/static/apple-icon-precomposed.png" />
          <link rel="icon" type="image/png" href="/static/apple-icon.png" />
          <link rel="icon" type="image/png" sizes="70x70" href="/static/ms-icon-70x70" />
          <link rel="icon" type="image/png" sizes="144x144" href="/static/ms-icon-144x144" />
          <link rel="icon" type="image/png" sizes="150x150" href="/static/ms-icon-150x150" />
          <link rel="icon" type="image/png" sizes="310x310" href="/static/ms-icon-310x310" />
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
