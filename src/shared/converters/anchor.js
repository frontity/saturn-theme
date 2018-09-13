import React from 'react';
import Anchor from '../components/Anchor';

export default {
  test: ({ component, attributes }) =>
    component === 'a' && attributes.href && /^#(\S+)/.test(attributes.href),
  process: (element, { extraProps }) => {
    const {
      attributes: { href, className },
    } = element;

    return children => (
      <Anchor
        key={href}
        hash={href}
        item={extraProps.item}
        className={className}
      >
        {children}
      </Anchor>
    );
  },
};
