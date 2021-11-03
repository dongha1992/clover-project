import React from 'react';

type TSvg = {
  [key: string]: () => React.SVGProps<SVGSVGElement> | any;
};

type TProps = {
  name: string;
};

const svgMap: TSvg = {
  location: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6 10.2583C14.6 11.7752 13.4117 12.9604 12 12.9604C10.5883 12.9604 9.4 11.7752 9.4 10.2583C9.4 8.74145 10.5883 7.55625 12 7.55625C13.4117 7.55625 14.6 8.74145 14.6 10.2583Z"
        stroke="#242424"
        strokeWidth="1.8"
      />
      <path
        d="M18.9999 10.1C18.9999 12.7548 17.5817 15.1233 15.8844 16.9947C14.4082 18.6224 12.8021 19.7833 11.9999 20.3161C11.1977 19.7833 9.59163 18.6224 8.1154 16.9947C6.41815 15.1233 4.99991 12.7548 4.99991 10.1C4.99991 6.50263 8.08497 3.5 11.9999 3.5C15.9149 3.5 18.9999 6.50263 18.9999 10.1Z"
        stroke="#242424"
        strokeWidth="2"
      />
    </svg>
  ),
  search: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 21L16.9862 16.9791M19.2105 11.6053C19.2105 13.6223 18.4093 15.5567 16.983 16.983C15.5567 18.4093 13.6223 19.2105 11.6053 19.2105C9.58822 19.2105 7.65379 18.4093 6.22753 16.983C4.80127 15.5567 4 13.6223 4 11.6053C4 9.58822 4.80127 7.65379 6.22753 6.22753C7.65379 4.80127 9.58822 4 11.6053 4C13.6223 4 15.5567 4.80127 16.983 6.22753C18.4093 7.65379 19.2105 9.58822 19.2105 11.6053Z"
        stroke="#242424"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  cart: () => (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.03369 5H17.9779C18.2604 5.00001 18.5398 5.05857 18.7981 5.17191C19.0563 5.28524 19.2877 5.45083 19.4773 5.65801C19.6669 5.86519 19.8105 6.10936 19.8988 6.37478C19.9871 6.64019 20.0182 6.92097 19.9901 7.199L19.3834 13.199C19.3335 13.6925 19.1 14.1501 18.7281 14.4829C18.3563 14.8157 17.8727 15 17.3712 15H7.71439C7.24669 15.0002 6.79338 14.84 6.43165 14.5469C6.06992 14.2537 5.82212 13.8456 5.73045 13.392L4.03369 5Z"
        stroke="#242424"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4.03354 5L3.21448 1.757C3.15971 1.54075 3.03344 1.34881 2.85573 1.21166C2.67802 1.0745 2.45906 1.00001 2.23364 1H1"
        stroke="#242424"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.06689 19H9.08925"
        stroke="#242424"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.1567 19H17.1791"
        stroke="#242424"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default function SVGIcon({ name }: TProps) {
  const MappedSVG = svgMap[name];

  return <MappedSVG />;
}
