import { IBodyProps } from '@lotsof/types/src/types/body/body.type';
import React from 'react';

export default function Body(props: IBodyProps) {
  const Subtitle = `h${props.suptitleLevel}`,
    Title = `h${props.titleLevel}`,
    Suptitle = `h${props.suptitleLevel}`;

  return (
    <div className="body typo-rhythm typo-format">
      <span>React</span>

      {props.suptitle && (
        <Suptitle className={`_suptitle typo-h${props.suptitleLevel}`}>
          {props.suptitle}
        </Suptitle>
      )}

      {props.title && (
        <Title className={`_title typo-h${props.suptitleLevel}`}>
          {props.suptitle}
        </Title>
      )}

      {props.subtitle && (
        <Subtitle className={`_suptitle typo-h${props.suptitleLevel}`}>
          {props.subtitle}
        </Subtitle>
      )}

      {props.lead && <p className="_lead typo-lead">{props.lead}</p>}

      {props.text && <p className="_text typo-p">{props.text}</p>}

      {props.buttons && (
        <div className="_buttons">
          {/* {props.buttons.map((button) => (
            // <Button {...button} />
          ))} */}
        </div>
      )}

      {/* @if (is_array($buttons) && count($buttons) > 0)
        <div className="_buttons">
            @foreach ($buttons as $button)
                @include ('button.button', (array) $button)
            @endforeach
        </div>
    @endif */}
    </div>
  );
}
