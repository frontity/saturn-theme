import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const resolverMap = new Map();
const observer = new window.MutationObserver(([{ target }]) => {
  const { contentWindow: content } = target.querySelector('iframe');
  const {
    document: frameDocument,
    google_ad_width: googleWidth,
    google_ad_height: googleHeight,
  } = content;

  if (!googleWidth || !googleHeight) {
    console.warn('Size is undefined!!!', target);
  }

  const listener = () => {
    if (frameDocument.readyState === 'interactive' || frameDocument.readyState === 'complete') {
      console.log('INTERACTIVE');
      frameDocument.removeEventListener('readystatechange', listener);
      const resolver = resolverMap.get(target);
      if (resolver) {
        resolver();
        resolverMap.delete(target);
      }
    }
  };
  frameDocument.addEventListener('readystatechange', listener);
});

let currentPush = Promise.resolve();

class AdSense extends PureComponent {
  static propTypes = {
    client: PropTypes.string.isRequired,
    slot: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    width: 300,
    height: 250,
  };

  constructor(props) {
    super(props);

    this.deferPush = this.deferPush.bind(this);
    this.push = this.push.bind(this);
  }

  componentDidMount() {
    if (window) {
      this.push();
      observer.observe(this.node, { childList: true });
    }
  }

  componentWillUnmount() {
    console.log('UNMOUNT');
    const resolver = resolverMap.get(this.node);
    if (resolver) {
      resolver();
      resolverMap.delete(this.node);
    }

    // Removes Google's handler for this ad
    const iframe = this.node.querySelector('iframe');
    if (iframe) {
      console.log('REMOVE HANDLER');
      const { google_iframe_oncopy: { handlers } } = window;
      delete handlers[iframe.id];
    }
  }

  deferPush() {
    return new Promise(resolve => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        resolverMap.set(this.node, resolve);
      } catch (e) {
        console.warn(e);
        resolve();
      }
    });
  }

  push() {
    console.log('PUSH');
    currentPush = currentPush.then(this.deferPush);
  }

  render() {
    const { client, slot, width, height } = this.props;
    return (
      <ins
        ref={ins => {
          this.node = ins;
        }}
        className="adsbygoogle"
        data-ad-client={client}
        data-ad-slot={slot}
        style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
      />
    );
  }
}

export default AdSense;
