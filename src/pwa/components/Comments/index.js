import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import ArrowIcon from '../../../shared/components/Icons/AngleDown';
import CommentsIcon from '../../../shared/components/Icons/Comments';

class CommentsWrapper extends Component {
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.props.isOpen) this.props.close();
    else this.props.open();
  }

  render() {
    const {
      id,
      type,
      useComments,
      isOpen,
      wasOpen,
      Comments,
      commentsText,
    } = this.props;

    return useComments ? (
      <Container>
        <Button onClick={this.toggle}>
          <CommentsIconWrapper>
            <CommentsIcon size={40} />
          </CommentsIconWrapper>
          <span>{commentsText}</span>
          <ArrowIconWrapper isOpen={isOpen}>
            <ArrowIcon size={40} />
          </ArrowIconWrapper>
        </Button>
        <InnerContainer isOpen={isOpen}>
          {wasOpen && <Comments type={type} id={id} />}
        </InnerContainer>
      </Container>
    ) : null;
  }
}

CommentsWrapper.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  useComments: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool,
  wasOpen: PropTypes.bool,
  open: PropTypes.func,
  close: PropTypes.func,
  Comments: PropTypes.func,
  commentsText: PropTypes.string,
};

CommentsWrapper.defaultProps = {
  isOpen: null,
  wasOpen: null,
  open: null,
  close: null,
  Comments: () => null,
  commentsText: '',
};

export default inject(
  ({ stores: { settings, theme }, components }, { type, id }) => {
    const useComments = !!settings.comments;

    return useComments
      ? {
          useComments,
          isOpen: theme.comments(type, id).isOpen,
          wasOpen: theme.comments(type, id).wasOpen,
          open: theme.comments(type, id).open,
          close: theme.comments(type, id).close,
          Comments: components.comments.Comments,
          commentsText: theme.lang.get('comments'),
        }
      : { useComments };
  },
)(CommentsWrapper);

const Container = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const Button = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: white !important;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #535353;
  outline: none;
`;

const CommentsIconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowIconWrapper = styled.div`
  transition: transform ${({ theme }) => theme.transitionTime};
  ${({ isOpen }) => isOpen && 'transform: rotate(180deg);'};
  will-change: transform;
`;

const InnerContainer = styled.div`
  overflow: hidden;
  height: ${({ isOpen }) => (isOpen ? '100%' : 0)};
`;
