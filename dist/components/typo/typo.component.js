import React from 'react';
export default function Typo(props) {
    return (React.createElement("div", { className: `typo typo-format typo-rhythm`, id: props.id, dangerouslySetInnerHTML: { __html: props.text } }));
}
//# sourceMappingURL=typo.component.js.map