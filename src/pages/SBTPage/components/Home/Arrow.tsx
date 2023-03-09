import React from 'react';
export default function Arrow({ fill = 'rgba(255, 255, 255, 0.4)', ...props }) {
  return (
    <svg
      width="9"
      height="5"
      viewBox="0 0 9 5"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.78033 0.209209C9.07322 0.488155 9.07322 0.940416 8.78033 1.21936L5.03033 4.79079C4.73744 5.06974 4.26256 5.06974 3.96967 4.79079L0.21967 1.21936C-0.0732231 0.940416 -0.0732231 0.488155 0.21967 0.20921C0.512563 -0.0697364 0.987437 -0.0697364 1.28033 0.20921L4.5 3.27556L7.71967 0.209209C8.01256 -0.0697365 8.48744 -0.0697365 8.78033 0.209209Z"
        fill="white"
        fill-opacity="0.4"
      />
    </svg>
  );
}
