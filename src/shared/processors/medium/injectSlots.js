import SlotInjector from '../../components/SlotInjector';

const CHARACTERS_LIMIT = 300;
const IMG_VALUE = 120;
const isTargetElement = {
  p: true,
  blockquote: true,
  ul: true,
  ol: true,
  div: true,
  img: true,
  figure: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  h7: true,
};

const hasReactAncestor = ({ parent }) =>
  !!parent &&
  (typeof parent.component === 'function' || hasReactAncestor(parent));

let sum = 0;
let positionNum = 0;

// high priority processor
export const restartCounter = {
  test: (element, { htmlTree }) => element === htmlTree[0],
  process: element => {
    sum = 0;
    positionNum = 0;
    return element;
  },
};

// medium priority processor
export const textCounter = {
  test: ({ type, component }) =>
    type === 'text' || component === 'img' || component === 'iframe',
  process: element => {
    sum += element.content ? element.content.length : IMG_VALUE;
    return element;
  },
};

// medium priority processor
export const injectSlot = {
  test: element =>
    sum > CHARACTERS_LIMIT &&
    element.component &&
    isTargetElement[element.component] &&
    !hasReactAncestor(element),
  process: (
    element,
    { stores: _stores, theme: _theme, item, htmlTree, ...fillChildProps },
  ) => {
    sum = 0;
    positionNum += 1;

    const isAboveTheFold = positionNum === 1;

    const { parent } = element;
    const children = parent ? parent.children : htmlTree;
    const position = `after ${CHARACTERS_LIMIT *
      positionNum} characters in content`;

    // duplicate current element
    children.splice(children.indexOf(element) + 1, 0, {
      ...element,
    });

    // replace current element by a slot
    return {
      component: SlotInjector,
      props: {
        key: position,
        isAboveTheFold,
        position,
        item,
        fillChildProps,
      },
      children: null,
    };
  },
};
