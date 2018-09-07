import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import LazyLoad from '@frontity/lazyload';
import IconVideo from '../../../shared/components/Icons/Video';

const LazyYoutube = ({ width, height, isAmp, youtubeId, attributes }) => {
  if (isAmp) {
    return (
      youtubeId && [
        <Helmet>
          <script
            async=""
            custom-element="amp-youtube"
            src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"
          />
        </Helmet>,
        <Container styles={{ height, width }}>
          <amp-youtube layout="fill" data-videoid={youtubeId} />
        </Container>,
      ]
    );
  }

  return (
    <Container styles={{ height, width }}>
      <Icon>
        <IconVideo size={40} />
      </Icon>
      <LazyLoad
        elementType="span"
        offsetVertical={2000}
        offsetHorizontal={-10}
        throttle={50}
      >
        <iframe title={attributes.title || youtubeId} {...attributes} />
      </LazyLoad>
    </Container>
  );
};

LazyYoutube.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  youtubeId: PropTypes.string,
  isAmp: PropTypes.bool.isRequired,
  attributes: PropTypes.shape({}).isRequired,
};

LazyYoutube.defaultProps = {
  youtubeId: null,
};

export default inject(({ stores: { build } }) => ({
  isAmp: build.isAmp,
}))(LazyYoutube);

const Container = styled.span`
  position: relative;
  box-sizing: border-box;
  width: ${({ styles }) => styles.width};
  height: ${({ styles }) => styles.height};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
  left: -15px;

  & > .LazyLoad {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: transparent;
    color: transparent;
    border: none;
  }

  amp-youtube,
  iframe {
    width: ${({ styles }) => styles.width};
    height: ${({ styles }) => styles.height};
  }
`;

const Icon = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  color: #bdbdbd;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
