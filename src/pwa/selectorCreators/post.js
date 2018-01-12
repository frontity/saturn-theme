import { dep } from 'worona-deps';
import readingTime from 'reading-time';
import fecha from 'fecha';
import { getInnerText } from '../../shared/helpers';

export const getTitle = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.title.rendered) || '';
};

export const getMedia = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.featured_media) || 0;
};

export const getDate = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.date) || '';
};

export const getFormattedDate = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.date && fecha.format(new Date(post.date), 'DD.MM.YYYY - HH:mm[h]')) || '';
};

export const getExcerpt = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  if (post) {
    return post.excerpt
      ? getInnerText(post.excerpt.rendered)
      : getInnerText(post.content.rendered)
          .split('. ')[0] // Gets first sentence.
          .concat('.'); // Appends removed point.
  }
  return '';
};

export const getContent = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.content.rendered) || '';
};

export const getUrl = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.link) || '';
};

export const getGlobalId = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.guid.rendered) || '';
};

export const getReadingTime = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  const content = post && post.content.rendered;
  return (content && Math.round(readingTime(content).minutes)) || 0;
};

export const getAuthor = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  const user = post && dep('connection', 'selectorCreators', 'getUserById')(post.author)(state);
  return (user && user.name) || '';
};

export const getAuthorId = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.author) || 0;
};

export const getCategoryList = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.categories) || [];
};

export const getCategoryName = id => state => {
  const category = dep('connection', 'selectorCreators', 'getCategoryById')(id)(state);
  return (category && category.name) || '';
};

export const getCategoryNameList = id => state => {
  const categories = getCategoryList(id)(state);
  return (categories && categories.map(category => getCategoryName(category)(state))) || '';
};

export const getTagList = id => state => {
  const post = dep('connection', 'selectorCreators', 'getPostById')(id)(state);
  return (post && post.tags) || [];
};

export const getTagName = id => state => {
  const tag = dep('connection', 'selectorCreators', 'getTagById')(id)(state);
  return (tag && tag.name) || '';
};
