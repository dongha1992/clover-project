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
  likeBlack: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 3.5C5.0151 3.5 3 5.61243 3 8.21864C3 10.3225 3.7875 15.3157 11.5392 20.3632C11.6781 20.4527 11.8375 20.5 12 20.5C12.1625 20.5 12.3219 20.4527 12.4608 20.3632C20.2125 15.3157 21 10.3225 21 8.21864C21 5.61243 18.9849 3.5 16.5 3.5C14.0151 3.5 12 6.35978 12 6.35978C12 6.35978 9.9849 3.5 7.5 3.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  couponDownloadAvailable: () => (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dd_2239_17414)">
        <circle cx="32" cy="28" r="24" fill="#35AD73" />
      </g>
      <path
        d="M36.2859 32.5727H27.7141C27.5331 32.5727 27.3589 32.6414 27.2267 32.7649C27.0944 32.8883 27.014 33.0573 27.0017 33.2377C26.9894 33.4181 27.046 33.5964 27.1602 33.7367C27.2744 33.877 27.4377 33.9687 27.617 33.9933L27.7141 34H36.2859C36.4669 33.9999 36.6411 33.9313 36.7733 33.8078C36.9056 33.6844 36.986 33.5154 36.9983 33.335C37.0107 33.1546 36.954 32.9762 36.8398 32.836C36.7256 32.6957 36.5623 32.604 36.383 32.5793L36.2859 32.5727ZM32.0972 22.0067L32 22C31.8274 22 31.6606 22.0625 31.5305 22.1758C31.4004 22.2892 31.3158 22.4457 31.2924 22.6166L31.2857 22.7137V29.1833L29.138 27.0385C29.0169 26.9176 28.8563 26.8441 28.6855 26.8315C28.5147 26.8189 28.345 26.8681 28.2075 26.97L28.1275 27.0385C28.0064 27.1595 27.9329 27.32 27.9203 27.4906C27.9077 27.6613 27.9569 27.8307 28.0589 27.9682L28.1275 28.0481L31.4952 31.4118C31.6162 31.5327 31.7765 31.6062 31.9471 31.6189C32.1177 31.6316 32.2872 31.5828 32.4248 31.4813L32.5048 31.4118L35.8726 28.0481C36.0004 27.9208 36.0752 27.7498 36.082 27.5696C36.0887 27.3894 36.027 27.2133 35.9091 27.0767C35.7912 26.9402 35.626 26.8532 35.4466 26.8334C35.2672 26.8136 35.0869 26.8624 34.942 26.97L34.862 27.0385L32.7143 29.1852V22.7137C32.7143 22.5412 32.6518 22.3746 32.5384 22.2446C32.4249 22.1146 32.2682 22.0301 32.0972 22.0067Z"
        fill="white"
      />
      <defs>
        <filter
          id="filter0_dd_2239_17414"
          x="0"
          y="0"
          width="64"
          height="64"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2239_17414"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_2239_17414"
            result="effect2_dropShadow_2239_17414"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_2239_17414"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  ),
  couponDownloadComplete: () => (
    <svg
      width="36"
      height="34"
      viewBox="0 0 36 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.1 23.57H5.08V22.5H0.78V28.67H1.57C3.17 28.67 4.43 28.62 5.82 28.37L5.69 27.28C4.5 27.48 3.41 27.55 2.1 27.57V23.57ZM8.98 25.05H7.64V21.65H6.32V30.88H7.64V26.14H8.98V25.05ZM13.3892 22.87C14.5592 22.87 15.2792 23.16 15.2792 23.73C15.2792 24.3 14.5592 24.59 13.3892 24.59C12.2392 24.59 11.5092 24.3 11.5092 23.73C11.5092 23.16 12.2392 22.87 13.3892 22.87ZM13.3892 25.64C15.3792 25.64 16.6992 24.9 16.6992 23.73C16.6992 22.57 15.3792 21.82 13.3892 21.82C11.4092 21.82 10.0792 22.57 10.0792 23.73C10.0792 24.9 11.4092 25.64 13.3892 25.64ZM11.5392 27.94H10.1992V30.7H16.6592V29.65H11.5392V27.94ZM9.22922 26.12V27.17H12.7992V28.75H14.1492V27.17H17.5692V26.12H9.22922ZM19.7084 23.89C19.7084 23.33 20.1384 23.01 20.7684 23.01C21.3984 23.01 21.8484 23.33 21.8484 23.89C21.8484 24.45 21.3984 24.77 20.7684 24.77C20.1384 24.77 19.7084 24.45 19.7084 23.89ZM23.5284 26.17C22.8684 26.27 22.1484 26.32 21.4384 26.36V25.7C22.4184 25.48 23.0684 24.79 23.0684 23.89C23.0684 22.79 22.1084 22.02 20.7684 22.02C19.4384 22.02 18.4784 22.79 18.4784 23.89C18.4784 24.8 19.1384 25.49 20.1184 25.7V26.41C19.3584 26.43 18.6284 26.43 17.9984 26.43L18.1584 27.48C19.6784 27.48 21.7484 27.45 23.6084 27.1L23.5284 26.17ZM20.5184 28.08H19.1984V30.7H25.6384V29.65H20.5184V28.08ZM25.3284 24.54V21.65H24.0084V28.68H25.3284V25.63H26.4884V24.54H25.3284ZM30.2377 27.37H31.8477V28.77H30.2377V27.37ZM33.1477 28.77V27.37H34.4377V26.31H29.0977V25.3H34.2277V22.24H27.7777V23.29H32.9277V24.27H27.7877V27.37H28.9377V28.77H26.8177V29.85H35.1677V28.77H33.1477Z"
        fill="#C8C8C8"
      />
      <path
        d="M13 9L16.75 13L23 5"
        stroke="#C8C8C8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  dotColumn: () => (
    <svg
      width="1"
      height="107"
      viewBox="0 0 1 107"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.5"
        y1="0.5"
        x2="0.499995"
        y2="106.5"
        stroke="#DEDEDE"
        strokeLinecap="round"
        strokeDasharray="2 6"
      />
    </svg>
  ),
  mockStar: () => (
    <svg
      width="90"
      height="18"
      viewBox="0 0 90 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.12523 1.57917C8.50592 0.891918 9.49405 0.891917 9.87474 1.57917L11.8426 5.13156C11.9804 5.38048 12.2178 5.55886 12.4953 5.62204L16.3922 6.50932C17.1242 6.676 17.4184 7.55983 16.9322 8.13192L14.2239 11.3189C14.0488 11.525 13.9646 11.7932 13.9905 12.0624L14.3951 16.2633C14.4691 17.0324 13.6803 17.5913 12.9793 17.2665L9.42039 15.6175C9.15374 15.494 8.84623 15.494 8.57958 15.6175L5.02072 17.2665C4.31971 17.5913 3.53086 17.0324 3.60491 16.2633L4.00944 12.0624C4.03536 11.7932 3.95117 11.525 3.77606 11.3189L1.06776 8.13193C0.581604 7.55983 0.875747 6.676 1.60777 6.50932L5.50467 5.62204C5.78213 5.55886 6.01953 5.38048 6.15742 5.13156L8.12523 1.57917Z"
        fill="#F4D740"
      />
      <path
        d="M26.1252 1.57917C26.5059 0.891918 27.494 0.891917 27.8747 1.57917L29.8426 5.13156C29.9804 5.38048 30.2178 5.55886 30.4953 5.62204L34.3922 6.50932C35.1242 6.676 35.4184 7.55983 34.9322 8.13192L32.2239 11.3189C32.0488 11.525 31.9646 11.7932 31.9905 12.0624L32.3951 16.2633C32.4691 17.0324 31.6803 17.5913 30.9793 17.2665L27.4204 15.6175C27.1537 15.494 26.8462 15.494 26.5796 15.6175L23.0207 17.2665C22.3197 17.5913 21.5309 17.0324 21.6049 16.2633L22.0094 12.0624C22.0354 11.7932 21.9512 11.525 21.7761 11.3189L19.0678 8.13193C18.5816 7.55983 18.8757 6.676 19.6078 6.50932L23.5047 5.62204C23.7821 5.55886 24.0195 5.38048 24.1574 5.13156L26.1252 1.57917Z"
        fill="#F4D740"
      />
      <path
        d="M44.1252 1.57917C44.5059 0.891918 45.494 0.891917 45.8747 1.57917L47.8426 5.13156C47.9804 5.38048 48.2178 5.55886 48.4953 5.62204L52.3922 6.50932C53.1242 6.676 53.4184 7.55983 52.9322 8.13192L50.2239 11.3189C50.0488 11.525 49.9646 11.7932 49.9905 12.0624L50.3951 16.2633C50.4691 17.0324 49.6803 17.5913 48.9793 17.2665L45.4204 15.6175C45.1537 15.494 44.8462 15.494 44.5796 15.6175L41.0207 17.2665C40.3197 17.5913 39.5309 17.0324 39.6049 16.2633L40.0094 12.0624C40.0354 11.7932 39.9512 11.525 39.7761 11.3189L37.0678 8.13193C36.5816 7.55983 36.8757 6.676 37.6078 6.50932L41.5047 5.62204C41.7821 5.55886 42.0195 5.38048 42.1574 5.13156L44.1252 1.57917Z"
        fill="#F4D740"
      />
      <path
        d="M62.1252 1.57917C62.5059 0.891918 63.494 0.891917 63.8747 1.57917L65.8426 5.13156C65.9804 5.38048 66.2178 5.55886 66.4953 5.62204L70.3922 6.50932C71.1242 6.676 71.4184 7.55983 70.9322 8.13192L68.2239 11.3189C68.0488 11.525 67.9646 11.7932 67.9905 12.0624L68.3951 16.2633C68.4691 17.0324 67.6803 17.5913 66.9793 17.2665L63.4204 15.6175C63.1537 15.494 62.8462 15.494 62.5796 15.6175L59.0207 17.2665C58.3197 17.5913 57.5309 17.0324 57.6049 16.2633L58.0094 12.0624C58.0354 11.7932 57.9512 11.525 57.7761 11.3189L55.0678 8.13193C54.5816 7.55983 54.8757 6.676 55.6078 6.50932L59.5047 5.62204C59.7821 5.55886 60.0195 5.38048 60.1574 5.13156L62.1252 1.57917Z"
        fill="#F4D740"
      />
      <path
        d="M80.1252 1.57917C80.5059 0.891918 81.494 0.891917 81.8747 1.57917L83.8426 5.13156C83.9804 5.38048 84.2178 5.55886 84.4953 5.62204L88.3922 6.50932C89.1242 6.676 89.4184 7.55983 88.9322 8.13192L86.2239 11.3189C86.0488 11.525 85.9646 11.7932 85.9905 12.0624L86.3951 16.2633C86.4691 17.0324 85.6803 17.5913 84.9793 17.2665L81.4204 15.6175C81.1537 15.494 80.8462 15.494 80.5796 15.6175L77.0207 17.2665C76.3197 17.5913 75.5309 17.0324 75.6049 16.2633L76.0094 12.0624C76.0354 11.7932 75.9512 11.525 75.7761 11.3189L73.0678 8.13193C72.5816 7.55983 72.8757 6.676 73.6078 6.50932L77.5047 5.62204C77.7821 5.55886 78.0195 5.38048 78.1574 5.13156L80.1252 1.57917Z"
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
