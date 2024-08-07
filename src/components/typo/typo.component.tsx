import React from 'react';
import type { ITypo } from './typo.type.js';

export default function Typo(props: ITypo) {
  return (
    <div
      className={`typo typo-format typo-rhythm`}
      id={props.id}
      dangerouslySetInnerHTML={{ __html: props.text }}
    ></div>
  );
}
