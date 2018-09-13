import React from 'react';
import LazyInstagram from '../components/LazyInstagram';
import { getInstagramId } from '../helpers';

export default {
  test: ({ component, attributes, ignore }) =>
    component === 'blockquote' &&
    attributes.className &&
    attributes.className.split(' ').includes('instagram-media') &&
    !ignore,
  process: element => {
    const { attributes, ...rest } = element;
    const height = 'auto';
    const width = '100%';

    // Overrrides style attributes
    const style = {
      ...attributes.style,
      width: '500px',
      maxWidth: '100%',
      margin: '0 auto',
      boxSizing: 'border-box',
    };

    const newAttributes = Object.assign(attributes, { style });
    element.children = [{ ...rest, attributes: newAttributes, ignore: true }];

    const instagramId = getInstagramId(element.children);

    return children => (
      <LazyInstagram
        key={`instagram${instagramId}`}
        width={width}
        height={height}
        throttle={50}
        instagramId={instagramId}
      >
        {children}
      </LazyInstagram>
    );
  },
};
