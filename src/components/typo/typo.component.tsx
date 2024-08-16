import React from 'react';
import type { TTypoProps } from './typo.type.js';

export default function Typo(props: TTypoProps) {
  return (
    <div
      className={`typo typo-format typo-rhythm`}
      id={props.id}
      dangerouslySetInnerHTML={{ __html: props.text }}
    ></div>
  );
}
