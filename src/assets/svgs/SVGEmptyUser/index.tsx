import { ReactElement, SVGProps } from 'react';

function SVGEmptyUser(props?: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 46" {...props}>
      <circle cx="23" cy="23" r="23" fill="#D4F1FC"/>
      <path fill="#28B9F0"
            fillRule="evenodd"
            d="M9.66 41.74v-2.18a13.34 13.34 0 0126.68 0v2.18A22.9 22.9 0 0123 46a22.9 22.9 0 01-13.34-4.26zm23.46-26.56a10.12 10.12 0 11-20.24 0 10.12 10.12 0 0120.24 0z"
            clipRule="evenodd"/>
    </svg>
  );
}

export default SVGEmptyUser;
