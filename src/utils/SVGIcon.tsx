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
  selectedBottomIcon: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.3953 8.27604C3.14626 8.46512 3 8.7598 3 9.07249V20.0002C3 20.5524 3.44772 21.0002 4 21.0002H9.75V13.0708H14.25V21.0002H20C20.5523 21.0002 21 20.5524 21 20.0002V9.07249C21 8.7598 20.8537 8.46512 20.6047 8.27604L12.6047 2.20208C12.2472 1.93069 11.7528 1.93069 11.3953 2.20208L3.3953 8.27604Z"
        fill="#242424"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 13.5C8 12.6716 8.67157 12 9.5 12H14.5C15.3284 12 16 12.6716 16 13.5V21H14V14H10V21H8V13.5Z"
        fill="#242424"
      />
    </svg>
  ),
  filter: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5.50006" cy="6" r="1.75" stroke="#242424" strokeWidth="1.5" />
      <line
        x1="7.75006"
        y1="6.0498"
        x2="14.2501"
        y2="6.0498"
        stroke="#242424"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="12.4999"
        cy="12"
        r="1.75"
        transform="rotate(180 12.4999 12)"
        stroke="#242424"
        strokeWidth="1.5"
      />
      <line
        x1="10.2499"
        y1="11.9502"
        x2="3.74994"
        y2="11.9502"
        stroke="#242424"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  removeItem: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="9" r="7" fill="#242424" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5263 6.47358C11.7879 6.73519 11.7879 7.15934 11.5263 7.42095L7.42106 11.5262C7.15945 11.7878 6.7353 11.7878 6.47369 11.5262C6.21208 11.2646 6.21208 10.8404 6.47369 10.5788L10.5789 6.47358C10.8406 6.21197 11.2647 6.21197 11.5263 6.47358Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5263 11.5263C11.2647 11.7879 10.8405 11.7879 10.5789 11.5263L6.47367 7.42106C6.21206 7.15945 6.21206 6.7353 6.47367 6.47369C6.73528 6.21208 7.15943 6.21208 7.42104 6.47369L11.5263 10.5789C11.7879 10.8406 11.7879 11.2647 11.5263 11.5263Z"
        fill="white"
      />
    </svg>
  ),
  uncheckedRectBox: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.75"
        y="1.75"
        width="14.5"
        height="14.5"
        rx="1.25"
        fill="white"
        stroke="#DEDEDE"
        strokeWidth="1.5"
      />
    </svg>
  ),
  checkedRectBox: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="2" fill="#35AD73" />
      <path
        d="M12 5.5L7 11L4 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  uncheckedRoundBox: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        r="7.25"
        fill="white"
        stroke="#DEDEDE"
        strokeWidth="1.5"
      />
    </svg>
  ),
  checkedRoundBox: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        r="5.5"
        fill="white"
        stroke="#35AD73"
        strokeWidth="5"
      />
    </svg>
  ),
  minus: () => (
    <svg
      width="4"
      height="3"
      viewBox="0 0 4 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.367297 2.192H3.6433V0.932H0.367297V2.192Z" fill="#242424" />
    </svg>
  ),
  plus: () => (
    <svg
      width="8"
      height="7"
      viewBox="0 0 8 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.3468 6.68H4.6548V4.136H7.0788V2.876H4.6548V0.319999H3.3468V2.876H0.922797V4.136H3.3468V6.68Z"
        fill="#242424"
      />
    </svg>
  ),
  defaultCancel: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="1.5"
        height="12.5253"
        rx="0.75"
        transform="matrix(0.707107 0.707107 -0.689737 0.72406 12.854 4)"
        fill="#242424"
      />
      <rect
        width="1.5"
        height="12.5253"
        rx="0.75"
        transform="matrix(-0.707107 0.707107 -0.72406 -0.689737 14.1299 12.854)"
        fill="#242424"
      />
    </svg>
  ),
  share: () => (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6361 19.4998C14.132 19.5056 13.6333 19.3944 13.1792 19.1749C12.7251 18.9553 12.3278 18.6334 12.0183 18.2342C11.7089 17.8351 11.4958 17.3695 11.3957 16.874C11.2955 16.3785 11.3111 15.8665 11.4411 15.3781L5.52895 11.9894C5.03022 12.4476 4.40313 12.741 3.73258 12.83C3.06203 12.9189 2.38042 12.7991 1.78003 12.4867C1.17965 12.1743 0.689505 11.6844 0.37596 11.0834C0.0624145 10.4824 -0.0593817 9.79925 0.0270628 9.12651C0.113507 8.45378 0.404016 7.82393 0.859254 7.32225C1.31449 6.82058 1.91247 6.47131 2.57221 6.32175C3.23195 6.17218 3.92159 6.22954 4.54775 6.48605C5.17391 6.74257 5.70634 7.18585 6.07294 7.75588L11.4401 4.67879C11.3707 4.41567 11.3339 4.14497 11.3306 3.87282C11.324 3.104 11.5818 2.3564 12.0606 1.75588C12.5393 1.15537 13.2098 0.73863 13.9591 0.575832C14.7084 0.413035 15.4908 0.514124 16.1744 0.862078C16.8581 1.21003 17.4013 1.7836 17.7127 2.4862C18.024 3.1888 18.0844 3.97752 17.8837 4.71956C17.683 5.46159 17.2335 6.11162 16.6108 6.56019C15.9882 7.00875 15.2304 7.22846 14.4651 7.18232C13.6998 7.13617 12.9737 6.82699 12.4091 6.30683L6.60088 9.63585C6.59427 9.8821 6.56027 10.1255 6.49794 10.3632L12.4101 13.751C12.8058 13.3868 13.2841 13.125 13.8036 12.9882C14.323 12.8514 14.8679 12.8438 15.391 12.966C15.914 13.0882 16.3995 13.3366 16.8051 13.6896C17.2108 14.0426 17.5244 14.4895 17.7188 14.9916C17.9132 15.4936 17.9825 16.0357 17.9207 16.5707C17.8589 17.1057 17.6678 17.6175 17.3641 18.0617C17.0603 18.5059 16.6531 18.869 16.1777 19.1196C15.7023 19.3702 15.1731 19.5007 14.6361 19.4998ZM14.6361 14.7643C14.2604 14.7643 13.9 14.914 13.6344 15.1804C13.3687 15.4469 13.2194 15.8082 13.2194 16.185C13.2194 16.5617 13.3687 16.9231 13.6344 17.1895C13.9 17.4559 14.2604 17.6056 14.6361 17.6056C15.0118 17.6056 15.3721 17.4559 15.6378 17.1895C15.9035 16.9231 16.0527 16.5617 16.0527 16.185C16.0527 15.8082 15.9035 15.4469 15.6378 15.1804C15.3721 14.914 15.0118 14.7643 14.6361 14.7643ZM3.30294 8.13472C2.92722 8.13472 2.56689 8.28439 2.30122 8.55081C2.03555 8.81723 1.88629 9.17857 1.88629 9.55535C1.88629 9.93213 2.03555 10.2935 2.30122 10.5599C2.56689 10.8263 2.92722 10.976 3.30294 10.976C3.67865 10.976 4.03898 10.8263 4.30465 10.5599C4.57032 10.2935 4.71958 9.93213 4.71958 9.55535C4.71958 9.17857 4.57032 8.81723 4.30465 8.55081C4.03898 8.28439 3.67865 8.13472 3.30294 8.13472ZM14.6361 2.45218C14.45 2.45218 14.2658 2.48893 14.0939 2.56032C13.9221 2.63172 13.7659 2.73636 13.6344 2.86828C13.5028 3.0002 13.3985 3.1568 13.3273 3.32916C13.2561 3.50152 13.2194 3.68626 13.2194 3.87282C13.2194 4.05938 13.2561 4.24411 13.3273 4.41647C13.3985 4.58883 13.5028 4.74544 13.6344 4.87736C13.7659 5.00927 13.9221 5.11392 14.0939 5.18531C14.2658 5.2567 14.45 5.29345 14.6361 5.29345C15.0118 5.29345 15.3721 5.14378 15.6378 4.87736C15.9035 4.61094 16.0527 4.24959 16.0527 3.87282C16.0527 3.49604 15.9035 3.1347 15.6378 2.86828C15.3721 2.60186 15.0118 2.45218 14.6361 2.45218Z"
        fill="#242424"
      />
    </svg>
  ),
  download: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.2859 13.5727H4.71412C4.53314 13.5727 4.35893 13.6414 4.22668 13.7649C4.09444 13.8883 4.01402 14.0573 4.00169 14.2377C3.98935 14.4181 4.04602 14.5964 4.16023 14.7367C4.27444 14.877 4.43768 14.9687 4.61698 14.9933L4.71412 15H13.2859C13.4669 14.9999 13.6411 14.9313 13.7733 14.8078C13.9056 14.6844 13.986 14.5154 13.9983 14.335C14.0107 14.1546 13.954 13.9762 13.8398 13.836C13.7256 13.6957 13.5623 13.604 13.383 13.5793L13.2859 13.5727ZM9.09716 3.00666L9.00001 3C8.8274 3.00001 8.66063 3.06246 8.53054 3.17581C8.40045 3.28917 8.31584 3.44575 8.29237 3.6166L8.2857 3.71366V10.1833L6.13799 8.03852C6.01687 7.91755 5.85628 7.84408 5.68548 7.83151C5.51468 7.81893 5.34504 7.86809 5.20748 7.97001L5.12747 8.03852C5.00639 8.15953 4.93286 8.31997 4.92027 8.49062C4.90768 8.66126 4.95688 8.83074 5.0589 8.96818L5.12747 9.04811L8.49523 12.4118C8.61618 12.5327 8.77652 12.6062 8.94711 12.6189C9.11769 12.6316 9.2872 12.5828 9.42479 12.4813L9.5048 12.4118L12.8726 9.04811C13.0004 8.92077 13.0752 8.74981 13.082 8.5696C13.0887 8.38939 13.027 8.2133 12.9091 8.07673C12.7912 7.94016 12.626 7.85324 12.4466 7.83344C12.2672 7.81364 12.0869 7.86243 11.942 7.97001L11.862 8.03852L9.71433 10.1852V3.71366C9.71432 3.5412 9.65181 3.37458 9.53835 3.24461C9.4249 3.11464 9.26817 3.03012 9.09716 3.00666Z"
        fill="#454545"
      />
    </svg>
  ),
  singleStar: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.12523 1.57917C8.50592 0.891918 9.49405 0.891917 9.87474 1.57917L11.8426 5.13156C11.9804 5.38048 12.2178 5.55886 12.4953 5.62204L16.3922 6.50932C17.1242 6.676 17.4184 7.55983 16.9322 8.13192L14.2239 11.3189C14.0488 11.525 13.9646 11.7932 13.9905 12.0624L14.3951 16.2633C14.4691 17.0324 13.6803 17.5913 12.9793 17.2665L9.42039 15.6175C9.15374 15.494 8.84623 15.494 8.57958 15.6175L5.02072 17.2665C4.31971 17.5913 3.53086 17.0324 3.60491 16.2633L4.00944 12.0624C4.03536 11.7932 3.95117 11.525 3.77606 11.3189L1.06776 8.13193C0.581604 7.55983 0.875747 6.676 1.60777 6.50932L5.50467 5.62204C5.78213 5.55886 6.01953 5.38048 6.15742 5.13156L8.12523 1.57917Z"
        fill="#F4D740"
      />
    </svg>
  ),
};

/* TODO: ref */

function SVGIcon({ name }: TProps) {
  const MappedSVG = svgMap[name];

  return <MappedSVG />;
}

export default SVGIcon;
