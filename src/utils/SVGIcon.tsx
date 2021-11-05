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
  searchIcon: () => (
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
  like: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4C4.3434 4 3 5.36686 3 7.05324C3 8.41455 3.525 11.6454 8.6928 14.9115C8.78537 14.9694 8.89164 15 9 15C9.10836 15 9.21463 14.9694 9.3072 14.9115C14.475 11.6454 15 8.41455 15 7.05324C15 5.36686 13.6566 4 12 4C10.3434 4 9 5.85045 9 5.85045C9 5.85045 7.6566 4 6 4Z"
        fill="#F42D2D"
        stroke="#F42D2D"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  home: () => (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.3999 3.2541L16.3999 8.56881V18.0002H11.6499V20.0002H17.3999C17.9522 20.0002 18.3999 19.5524 18.3999 19.0002V8.07249C18.3999 7.7598 18.2536 7.46512 18.0046 7.27604L10.0046 1.20208C9.64715 0.930686 9.15266 0.930686 8.7952 1.20208L0.795201 7.27604C0.546162 7.46512 0.399902 7.7598 0.399902 8.07249V19.0002C0.399902 19.5524 0.847618 20.0002 1.3999 20.0002H7.1499V18.0002H2.3999V8.56881L9.3999 3.2541Z"
        fill="#242424"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.1499 13.7036C6.1499 12.8752 6.82148 12.2036 7.6499 12.2036H11.1499C11.9783 12.2036 12.6499 12.8752 12.6499 13.7036V20.0003H10.6499V14.2036H8.1499V20.0003H6.1499V13.7036Z"
        fill="#242424"
      />
    </svg>
  ),
  arrowDown: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.31696 11.5883C9.15684 11.7963 8.84316 11.7963 8.68304 11.5883L6.03165 8.144C5.82917 7.88097 6.01667 7.5 6.34861 7.5L11.6514 7.5C11.9833 7.5 12.1708 7.88097 11.9684 8.144L9.31696 11.5883Z"
        fill="#242424"
      />
    </svg>
  ),
  arrowLeft: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="14"
        width="2"
        height="18"
        rx="1"
        transform="rotate(-90 4 14)"
        fill="#242424"
      />
      <path
        d="M10.5 5.5L3 13L10.5 20.5"
        stroke="#242424"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  locationBlack: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 7.6C14.5 11.623 10.881 14.6465 9.51425 15.6449C9.20524 15.8707 8.79476 15.8707 8.48575 15.6449C7.11903 14.6465 3.5 11.623 3.5 7.6C3.5 4.50721 5.96243 2 9 2C12.0376 2 14.5 4.50721 14.5 7.6Z"
        fill="#242424"
      />
      <circle cx="9" cy="7" r="2" fill="white" />
    </svg>
  ),
};

export default function SVGIcon({ name }: TProps) {
  const MappedSVG = svgMap[name];

  return <MappedSVG />;
}
