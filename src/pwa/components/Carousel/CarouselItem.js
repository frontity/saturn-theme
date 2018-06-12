/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Link from '../Link';
import Image from '../../../shared/components/Image';

const CarouselItem = ({ item, context, media, title }) => (
  <Container>
    <Link
      type={item.type}
      id={item.id}
      page={item.page}
      context={context}
      eventCategory="Post"
      eventAction="open single"
    >
      <a>
        <Image lazy offsetHorizonal={30} id={media} width="60vw" height="100%" />
        <InnerContainer>
          <Title>
            <span dangerouslySetInnerHTML={{ __html: title }} />
          </Title>
        </InnerContainer>
      </a>
    </Link>
  </Container>
);

CarouselItem.propTypes = {
  item: PropTypes.shape({}).isRequired,
  context: PropTypes.shape({}),
  media: PropTypes.number,
  title: PropTypes.string.isRequired,
};

CarouselItem.defaultProps = {
  context: null,
  media: null,
};

export default CarouselItem;

const Container = styled.li`
  box-sizing: border-box;
  width: 60vw;
  height: 100%;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.white};
  position: relative;
`;

const InnerContainer = styled.div`
  box-sizing: border-box;
  bottom: 0;
  width: 100%;
  height: 4rem;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
`;

const Title = styled.div`
  margin: 0.5rem auto;
  width: 90%;
  height: 3rem;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  span {
    line-height: 1.5rem;
    font-size: 1rem;
  }
`;
