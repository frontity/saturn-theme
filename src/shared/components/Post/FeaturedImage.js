/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import Link from '../../../pwa/components/Link';
import Image from '../Image';
import SharedCount from './SharedCount';
import ReadingTime from './ReadingTime';
import { media as mediaContext } from '../../contexts';

const FeaturedImage = ({
  type,
  id,
  media,
  featuredImageHeight,
  sharedCountPosition,
  readingTimePosition,
  contentContext,
}) =>
  media ? (
    <Container>
      <Link
        type="media"
        id={media}
        context={mediaContext(contentContext || [])}
        eventCategory="Post"
        eventAction="open featured media"
      >
        <a>
          <Image id={media} height={featuredImageHeight} width="100%" />
        </a>
      </Link>
      {(sharedCountPosition === 'featured-image' ||
        readingTimePosition === 'featured-image') && (
        <InnerContainer>
          {sharedCountPosition === 'featured-image' && (
            <SharedCount type={type} id={id} />
          )}
          {readingTimePosition === 'featured-image' && (
            <ReadingTime type={type} id={id} />
          )}
        </InnerContainer>
      )}
    </Container>
  ) : null;

FeaturedImage.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  media: PropTypes.number,
  featuredImageHeight: PropTypes.string,
  sharedCountPosition: PropTypes.string,
  readingTimePosition: PropTypes.string,
  contentContext: PropTypes.arrayOf(PropTypes.number).isRequired,
};

FeaturedImage.defaultProps = {
  media: null,
  featuredImageHeight: '250px',
  sharedCountPosition: 'header',
  readingTimePosition: 'header',
};

export default inject(({ stores: { connection, settings } }, { type, id }) => {
  const featuredImage = settings.theme.featuredImage || {};
  const sharedCount = settings.theme.sharedCount || {};
  const readingTime = settings.theme.readingTime || {};
  const medias = connection.entity(type, id).media;

  return {
    media: medias.featured.id,
    featuredImageHeight: featuredImage.height,
    sharedCountPosition: sharedCount.position,
    readingTimePosition: readingTime.position,
    contentContext: [medias.featured.id]
      .concat(medias.content)
      .reduce((final, current) => {
        if (!final.includes(current)) final.push(current);
        return final;
      }, []),
  };
})(FeaturedImage);

const Container = styled.div`
  position: relative;
`;

const InnerContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.4);
  color: ${({ theme }) => theme.colors.white};
  height: 36px;
`;
