import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import Lazy from '../../../shared/components/LazyAnimated';
import SameHeight from '../SameHeight';
import Header from '../../../shared/components/Post/Header';
import Body from './Body';
import Spinner from '../../../shared/components/Spinner';

const lazyRootProps = {
  offsetVertical: 2000,
  offsetHorizontal: 50,
  debounce: false,
  throttle: 100,
};

const Post = ({ type, id, columnId, ready }) =>
  ready ? (
    <Container id={columnId}>
      <LazyRoot
        {...lazyRootProps}
        placeholder={
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
        }
      >
        <Header type={type} id={id} />
        <Body type={type} id={id} columnId={columnId} />
      </LazyRoot>
    </Container>
  ) : (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );

Post.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  columnId: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default inject(({ stores: { connection } }, { type, id }) => ({
  ready: connection.entity(type, id).isReady,
}))(Post);

const Container = styled(SameHeight)`
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  z-index: 0;
  position: relative;
  border-bottom: 1px solid #eee;
`;

const LazyRoot = styled(Lazy)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SpinnerContainer = styled.div`
  width: 100%;
  height: 100vh;
`;
