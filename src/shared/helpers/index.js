/* eslint-disable global-require */
import Color from 'color-js';
import { parse } from 'himalaya';
import he from 'he';
import fd from 'fastdom/';
import fdPromised from 'fastdom/extensions/fastdom-promised';

// This function returns the contrast between two colors.
export const getContrast = (color1, color2) => {
  const lum1 = color1.getLuminance();
  const lum2 = color2.getLuminance();

  if (lum1 > lum2) {
    return (lum1 + 0.05) / (lum2 + 0.05);
  }

  return (lum2 + 0.05) / (lum1 + 0.05);
};

// This function darkens a color if the contrast between it and white is low.
export const darkenColor = colorCode => {
  const white = Color('white');
  let color = Color(colorCode);

  while (getContrast(color, white) < 3) {
    color = color.darkenByAmount(0.1);
  }

  return color.toString();
};

// This function gets a color and returns the color black or white depending on contrast.
export const getBlackOrWhite = colorCode => {
  const color = Color(colorCode);
  const white = Color('white');

  return getContrast(color, white) > 1.6 ? '#FFF' : '#000';
};

// This function gets a string with html and returns only the text inside.
export const getInnerText = htmlString => {
  const getElementText = ({ type, content, children = [] }) =>
    type === 'text'
      ? he.decode(content)
      : children.reduce((t, e) => t.concat(getElementText(e)), '');

  return parse(htmlString).reduce((t, e) => t.concat(getElementText(e)), '');
};

export const getAltBackground = colorCode => {
  const color = Color(colorCode);
  const white = Color('white');
  return getContrast(color, white) > 1.6 ? colorCode : '#000';
};

export const getAltText = colorCode => {
  const color = Color(colorCode);
  const white = Color('white');
  return getContrast(color, white) > 1.6 ? getBlackOrWhite(colorCode) : '#FFF';
};

// This function gets the main theme color from database end returns the theme props.
export const getThemeProps = color => ({
  colors: {
    background: color,
    text: getBlackOrWhite(color),
    link: darkenColor(color),
    shadow: '#999',
    white: '#FFF',
    grey: '#AAA',
    black: '#333',
    evilGrey: '#666',
    facebook: '#3b5998',
    twitter: '#1da1f2',
    whatsapp: '#2cb742',
    email: '#7f7f7f',
    share: '#006ca0',
    googlePlus: '#db4437',
    telegram: '#0088cc',
    pinterest: '#cb2128',
    linkedin: '#0077b5',
    copy: '#8fa9ba',
    altBackground: getAltBackground(color),
    altText: getAltText(color),
  },
  heights: {
    bar: '54px',
    navbar: '30px',
    menuHeader: '100px',
  },
  shadows: {
    top: '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.15)',
    bottom: '0 -1px 3px rgba(0,0,0,0.10), 0 -1px 2px rgba(0,0,0,0.15)',
  },
  logoFontSize: '1.3rem',
});

// This function iterates the element object recursively until it finds an 'Element'
// with tagName 'a' and its 'href' attribute matches a RegExp that captures a tweet ID.
export const getTweetId = children => {
  if (!children) return '';

  const results = [];

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    if (child.type === 'Element' && child.tagName === 'a') {
      const match = child.attributes.href.match(/\/status\/(\d+)/);

      if (match) return match[1];
    }

    if (child.children) results.push(getTweetId(child.children));
  }

  return results.reduce((result, current) => current || result, '');
};

// This function iterates the element object recursively until it finds an 'Element'
// with tagName 'a' and its 'href' attribute matches a RegExp that captures an instagram ID.
export const getInstagramId = children => {
  if (!children) return '';

  const results = [];

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    if (child.type === 'Element' && child.tagName === 'a') {
      const match = child.attributes.href.match(
        /https:\/\/www\.instagram\.com\/p\/([\w\d]+)/,
      );

      if (match) return match[1];
    }

    if (child.children) results.push(getInstagramId(child.children));
  }

  return results.reduce((result, current) => current || result, '');
};

// Request for JSONP endpoint.
export const getContent = endpoint =>
  new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = endpoint.startsWith('https')
      ? require('https')
      : require('http');
    const req = lib.get(endpoint, response => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(
          new Error(`Failed to load page, status code: ${response.statusCode}`),
        );
      }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', chunk => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the req
    req.on('error', err => reject(err));
  });

// This function is a polyfill that gets the scrolling element in any kind of browser.
const fastdom = fd.extend(fdPromised);
let scrollingElement = null;
export const getScrollingElement = async () => {
  if (scrollingElement) return scrollingElement;

  const { document } = window;

  if (document.scrollingElement) {
    ({ scrollingElement } = document);
    return scrollingElement;
  }

  const iframe = document.createElement('iframe');
  document.documentElement.appendChild(iframe);
  const doc = iframe.contentWindow.document;

  await fastdom.mutate(() => {
    doc.write('<!DOCTYPE html><div style="height:9999em">x</div>');
    doc.close();
    iframe.style.height = '1px';
  });

  const isCompliant = await fastdom.measure(
    () => doc.documentElement.scrollHeight > doc.body.scrollHeight,
  );

  iframe.parentNode.removeChild(iframe);
  scrollingElement = isCompliant ? document.documentElement : document.body;
  return scrollingElement;
};
