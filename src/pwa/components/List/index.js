import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';
import ListItem from './ListItem';
import ListItemFirst from './ListItemFirst';
import ListItemAlt from './ListItemAlt';
import SlotInjector from '../../../shared/components/SlotInjector';
import Spinner from '../../../shared/components/Spinner';
import { single } from '../../../shared/contexts';

class List extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    page: PropTypes.number,
    columnId: PropTypes.string.isRequired,
    ready: PropTypes.bool.isRequired,
    list: MobxPropTypes.observableArray.isRequired,
    context: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    page: null,
  };

  constructor(props) {
    super(props);

    const { type, id, page, columnId } = props;
    this.item = { type, id, page, mstId: columnId };

    this.renderListItems = this.renderListItems.bind(this);
  }

  renderListItems(entity, index) {
    const { type, id, page, context } = this.props;
    const {
      title,
      media: { featured },
      excerpt,
      content,
    } = entity;
    const item = {
      type: entity.type,
      id: entity.id,
      fromList: { type, id, page },
    };

    let ListItemType;

    if (!index) ListItemType = ListItemFirst;
    else if (index % 3 === 0) ListItemType = ListItemAlt;
    else ListItemType = ListItem;

    const isAboveTheFold = index < 4;

    return (
      <Fragment key={entity.mstId}>
        <ListItemType
          type={entity.type}
          id={entity.id}
          title={title}
          media={featured.id}
          excerpt={excerpt || content}
          item={item}
          context={context}
        />
        <SlotInjector
          position={`after post ${index + 1}`}
          item={this.item}
          isAboveTheFold={isAboveTheFold}
        />
      </Fragment>
    );
  }

  render() {
    const { ready, list } = this.props;

    // Render posts and ads
    const items = list.map(this.renderListItems);

    return ready ? (
      <Container>
        <SlotInjector
          position="before post 1"
          item={this.item}
          isAboveTheFold
        />
        {items}
      </Container>
    ) : (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    );
  }
}

export default inject(({ stores: { connection } }, { type, id, page }) => ({
  ready: connection.list(type, id).isReady,
  list: connection.list(type, id).page(page).entities,
  context: single([{ type, id, page, extract: 'horizontal' }]),
}))(List);

const Container = styled.div`
  box-sizing: border-box;
  z-index: -1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  a {
    text-decoration: none;
    color: inherit;
    margin: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SpinnerContainer = styled.div`
  height: calc(
    100vh - ${({ theme }) => `${theme.heights.bar} - ${theme.heights.navbar}`}
  );
  display: flex;
  justify-content: center;
  align-items: center;
`;
