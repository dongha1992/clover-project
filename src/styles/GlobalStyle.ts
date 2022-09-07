import { createGlobalStyle } from 'styled-components';
import { textBody2, theme } from '@styles/theme';

const GlobalStyle = createGlobalStyle`
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
        font-family: 'Noto Sans KR', sans-serif;
        
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }



    @media(max-width:512px){
        body{
            // 버튼 터치시 음영 삭제
            -webkit-tap-highlight-color:rgba(255,255,255,0);
            user-select: none;
        }
    }

    html{
        overscroll-behavior-y: none;
        
    }
    
    body {
        line-height: 1;
        margin: 0 auto;
        width: 100%;
        overscroll-behavior-y: none;
    }

    body, button, input, textarea, select {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: none;
    }

    input[type="color"],
    input[type="date"],
    input[type="datetime"],
    input[type="datetime-local"],
    input[type="email"],
    input[type="month"],
    input[type="number"],
    input[type="password"],
    input[type="search"],
    input[type="tel"],
    input[type="text"],
    input[type="time"],
    input[type="url"],
    input[type="week"],
    select:focus,
    textarea {
        font-size: 16px;
        font-family: 'Noto Sans KR', sans-serif;
    }
    input:focus::-webkit-input-placeholder { color:transparent; }
    input:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
    input:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
    input:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */

    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    a, a:link, a:visited, a:focus, a:hover, a:active {
        text-decoration: none; 
    }
    button{
        border: none;
        background-color: transparent;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    * {
        box-sizing: border-box;
        ::-webkit-scrollbar { display: none; }
        -webkit-touch-callout: none;
    }

    a {
        -webkit-tap-highlight-color: transparent;
        color: inherit;
    }

`;

export default GlobalStyle;
