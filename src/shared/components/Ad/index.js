import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { connect } from 'react-redux';
import { isMatch } from 'lodash';
import styled from 'react-emotion';
import Lazy from '../LazyUnload';

import AdSense from './AdSense';
import SmartAd from './SmartAd';
import DoubleClick from './DoubleClick';

const mapAds = {
  adsense: AdSense,
  smartads: SmartAd,
  doubleclick: DoubleClick,
};

const Ad = ({ type, width, height, active, isAmp, ...adProps }) => {
  const SelectedAd = mapAds[type];

  if (!SelectedAd) return null;

  if (isAmp) {
    return (
      <Container isSticky={adProps.sticky} styles={{ width, height }}>
        <SelectedAd width={width} height={height} isAmp={isAmp} {...adProps} />
      </Container>
    );
  }

  return (
    <Container isSticky={adProps.sticky} styles={{ width, height }}>
      <IconContainer>
        <IconText>ad</IconText>
      </IconContainer>
      <StyledLazy
        active={active}
        height={height}
        width={width}
        offset={1200}
        debounce={false}
        minTime={2000}
        maxTime={3000}
      >
        <SelectedAd width={width} height={height} isAmp={isAmp} {...adProps} />
      </StyledLazy>
    </Container>
  );
};

Ad.propTypes = {
  type: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool.isRequired,
  isAmp: PropTypes.bool.isRequired,
};

Ad.defaultProps = {
  type: 'smartads',
  width: '100%',
  height: 250,
};

const mapStateToProps = state => ({
  isAmp: state.build.amp,
});

export default connect(mapStateToProps)(
  inject(({ connection }, { item }) => {
    const { selected } = connection;
    return {
      active: isMatch(selected, item),
    };
  })(Ad),
);

const Container = styled.div`
  margin: ${({ isSticky }) => (isSticky ? '' : '10px auto')};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: calc(100% - 30px);
  height: ${({ styles }) =>
    typeof styles.height === 'string' ? `calc(${styles.height} + 1px)` : `${styles.height + 1}px`};
  width: ${({ styles }) => (typeof styles.width === 'string' ? styles.width : `${styles.width}px`)};
  overflow: hidden;

  * {
    max-width: 100%;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconText = styled.span`
  margin: 0;
  padding: 3px 5px;
  font-size: 20px;
  line-height: 20px;
  color: #bdbdbd;
  text-transform: uppercase;
  border: 3px solid #bdbdbd;
  border-radius: 4px;
`;

const StyledLazy = styled(Lazy)`
  position: absolute;
  top: 0;
  left: 0;
  height: ${({ height }) => (typeof height === 'string' ? height : `${height}px`)};
  width: ${({ width }) => (typeof width === 'string' ? width : `${width}px`)};
  z-index: 1;
`;
