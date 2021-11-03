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
};

export default function SVGIcon({ name }: TProps) {
  const MappedSVG = svgMap[name];

  return <MappedSVG />;
}
