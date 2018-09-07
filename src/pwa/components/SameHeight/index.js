import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class SameHeight extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  static heights = {};

  componentDidUpdate() {
    const { id } = this.props;
    const { container } = this;

    if (id && container) {
      SameHeight.heights[id] = container.offsetHeight;
    }
  }

  componentWillUnmount() {
    const { id } = this.props;
    const { container } = this;

    if (id && container) {
      const height = container.offsetHeight;
      SameHeight.heights[id] = Math.max(
        SameHeight.heights[id] || 0,
        height || 0,
      );
    }
  }

  render() {
    return (
      <Container
        minHeight={SameHeight.heights[this.props.id]}
        innerRef={ref => {
          this.container = ref;
        }}
      >
        {this.props.children}
      </Container>
    );
  }
}

export default SameHeight;

const Container = styled.div`
  ${({ minHeight }) =>
    typeof minHeight === 'number' ? `min-height: ${minHeight}px;` : ''};
  display: flex;
  flex-direction: column;

  & > .LazyLoad {
    flex: 1;
    display: flex;
    flex-direction: column;

    & > div {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
`;
