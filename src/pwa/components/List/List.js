import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import ListItem from './ListItem';
import ListItemFirst from './ListItemFirst';
import ListItemAlt from './ListItemAlt';
import LoadMore from './LoadMore';
import Ad from '../../elements/Ad';
import Footer from '../Footer';
import Spinner from '../../elements/Spinner';
import * as selectors from '../../selectors';

class List extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    ready: PropTypes.bool.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    active: PropTypes.bool.isRequired,
    adList: PropTypes.arrayOf(PropTypes.shape({})),
    firstAdPosition: PropTypes.number,
    postsBeforeAd: PropTypes.number,
  };

  static defaultProps = {
    adList: null,
    firstAdPosition: null,
    postsBeforeAd: null,
  };

  constructor() {
    super();

    this.renderListItems = this.renderListItems.bind(this);
  }

  renderListItems(post, index) {
    const { firstAdPosition, postsBeforeAd, adList } = this.props;
    const { id, title, featured, excerpt, content } = post;
    let ListItemType;

    if (!index) ListItemType = ListItemFirst;
    else if (index % 3 === 0) ListItemType = ListItemAlt;
    else ListItemType = ListItem;

    let adConfig = null;

    if (adList.length > 0) {
      const currentIndex = index - firstAdPosition;
      const validIndex = currentIndex >= 0 && currentIndex % postsBeforeAd === 0;

      if (validIndex) {
        adConfig = adList[Math.floor((index - firstAdPosition) / postsBeforeAd)];
      }
    }

    return (
      <div key={index}>
        {adConfig && <Ad {...adConfig} />}
        <ListItemType id={id} title={title} media={featured.id} excerpt={excerpt || content} />
      </div>
    );
  }

  render() {
    const { id, type, ready, list, active } = this.props;

    return ready ? (
      <Container>
        {list.map(this.renderListItems)}
        {active && <LoadMore id={id} type={type} />}
        <Footer />
      </Container>
    ) : (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    );
  }
}

const mapStateToProps = state => ({
  adList: selectors.ads.getList(state),
  firstAdPosition: selectors.ads.firstAdPosition(state),
  postsBeforeAd: selectors.ads.postsBeforeAd(state),
});

export default connect(mapStateToProps)(
  inject(({ connection }, { type, id }) => ({
    ready: connection.list[type][id].ready,
    list: connection.list[type][id].entities,
  }))(List),
);

const Container = styled.div`
  box-sizing: border-box;
  padding-top: ${({ theme }) => `calc(${theme.titleSize} + ${theme.navbarSize})`};
  z-index: -1;
  overflow-x: hidden;
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
  margin-top: 100%;
`;