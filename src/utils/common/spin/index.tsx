import React from 'react';
import styled from 'styled-components';

const Spinner = ()=> {
  return (
    <Container>
      <div className='ring-of-dots'></div>
    </Container>
  )
};

const Container = styled.div`

  @-webkit-keyframes ring-of-dots {
    0% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73; }
    14.28571% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 #BDE1CF, -4.45042px -19.49856px 0 0 #35AD73, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 #BDE1CF, -4.45042px -19.49856px 0 0 #35AD73, 12.4698px -15.63663px 0 0 white; }
    28.57143% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 #BDE1CF, -18.01938px -8.67767px 0 0 #35AD73, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 #BDE1CF, -18.01938px -8.67767px 0 0 #35AD73, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    42.85714% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 #BDE1CF, -18.01938px 8.67767px 0 0 #35AD73, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 #BDE1CF, -18.01938px 8.67767px 0 0 #35AD73, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    57.14286% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 #BDE1CF, -4.45042px 19.49856px 0 0 #35AD73, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 #BDE1CF, -4.45042px 19.49856px 0 0 #35AD73, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    71.42857% {
      -webkit-box-shadow: 20px 0px 0 0 #BDE1CF, 12.4698px 15.63663px 0 0 #35AD73, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 #BDE1CF, 12.4698px 15.63663px 0 0 #35AD73, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    85.71429% {
      -webkit-box-shadow: 20px 0px 0 0 #35AD73, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 #BDE1CF;
              box-shadow: 20px 0px 0 0 #35AD73, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 #BDE1CF; }
    100% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73; } }

  @keyframes ring-of-dots {
    0% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73; }
    14.28571% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 #BDE1CF, -4.45042px -19.49856px 0 0 #35AD73, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 #BDE1CF, -4.45042px -19.49856px 0 0 #35AD73, 12.4698px -15.63663px 0 0 white; }
    28.57143% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 #BDE1CF, -18.01938px -8.67767px 0 0 #35AD73, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 #BDE1CF, -18.01938px -8.67767px 0 0 #35AD73, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    42.85714% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 #BDE1CF, -18.01938px 8.67767px 0 0 #35AD73, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 #BDE1CF, -18.01938px 8.67767px 0 0 #35AD73, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    57.14286% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 #BDE1CF, -4.45042px 19.49856px 0 0 #35AD73, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 #BDE1CF, -4.45042px 19.49856px 0 0 #35AD73, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    71.42857% {
      -webkit-box-shadow: 20px 0px 0 0 #BDE1CF, 12.4698px 15.63663px 0 0 #35AD73, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white;
              box-shadow: 20px 0px 0 0 #BDE1CF, 12.4698px 15.63663px 0 0 #35AD73, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 white; }
    85.71429% {
      -webkit-box-shadow: 20px 0px 0 0 #35AD73, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 #BDE1CF;
              box-shadow: 20px 0px 0 0 #35AD73, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 white, 12.4698px -15.63663px 0 0 #BDE1CF; }
    100% {
      -webkit-box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73;
              box-shadow: 20px 0px 0 0 white, 12.4698px 15.63663px 0 0 white, -4.45042px 19.49856px 0 0 white, -18.01938px 8.67767px 0 0 white, -18.01938px -8.67767px 0 0 white, -4.45042px -19.49856px 0 0 #BDE1CF, 12.4698px -15.63663px 0 0 #35AD73; } }
  
  .ring-of-dots:before {
    animation: ring-of-dots 1s infinite linear reverse;
    border-radius: 10px;
    content: '';
    display: block;
    height: 10px;
    width: 10px; 
  }
`;
 
export default Spinner;