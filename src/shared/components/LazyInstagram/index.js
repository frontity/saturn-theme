import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import LazyLoad from '@frontity/lazyload';
import styled from 'styled-components';
import IconInstagram from '../Icons/Instagram';

class LazyInstagram extends Component {
  static propTypes = {
    children: PropTypes.shape({}).isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    instagramId: PropTypes.string.isRequired,
    isAmp: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.ref = null;
    this.state = {
      loaded: false,
    };

    this.handleContentVisible = this.handleContentVisible.bind(this);
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return this.state.loaded !== nextState.loaded;
  }

  componentDidUpdate() {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else if (!window.document.getElementById('lazy-instagram')) {
      const script = window.document.createElement('script');
      script.id = 'lazy-instagram';
      script.src = '//platform.instagram.com/en_US/embeds.js';
      script.async = true;
      script.chartset = 'utf-8';
      script.onload = () => window.instgrm.Embeds.process();

      window.document.body.appendChild(script);
    }
  }

  handleContentVisible() {
    this.setState({
      loaded: true,
    });
  }

  render() {
    const { children, width, height, isAmp, instagramId } = this.props;
    const { loaded } = this.state;

    if (isAmp) {
      return [
        <Helmet>
          <script
            async=""
            custom-element="amp-instagram"
            src="https://cdn.ampproject.org/v0/amp-instagram-0.1.js"
          />
        </Helmet>,
        <Container
          styles={{ height, width }}
          ref={node => {
            this.ref = node;
          }}
        >
          <amp-instagram
            data-shortcode={instagramId}
            data-captioned
            width="1"
            height="1"
            layout="responsive"
          />
        </Container>,
      ];
    }

    return (
      <Container
        styles={{ height, width }}
        ref={node => {
          this.ref = node;
        }}
      >
        {!loaded && (
          <Icon>
            <IconInstagram size={40} />
          </Icon>
        )}
        <StyledLazyLoad
          offsetVertical={2000}
          offsetHorizontal={-10}
          throttle={50}
          onContentVisible={this.handleContentVisible}
        >
          {children}
        </StyledLazyLoad>
      </Container>
    );
  }
}

export default inject(({ stores: { build } }) => ({
  isAmp: build.isAmp,
}))(LazyInstagram);

const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  width: ${({ styles }) => styles.width};
  height: ${({ styles }) => styles.height};
  min-height: 170px;
  margin: 15px 0;

  blockquote {
    margin: 0;
  }

  amp-instagram,
  iframe {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 65px;
  left: 0;
  color: #bdbdbd;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLazyLoad = styled(LazyLoad)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background-color: transparent;
  border: none;
  z-index: 10;
`;
