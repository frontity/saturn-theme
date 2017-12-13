import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import Media from '../Media';
import Header from './Header';
import Content from '../../elements/Content';
import SeoWord from '../../elements/SeoWord';
import TagList from './TagList';
import Spinner from '../../elements/Spinner';
import Comments from '../Comments';
import Carousel from '../Carousel';
import Footer from '../Footer';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

class Post extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    allShareCountRequested: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    media: PropTypes.number,
    slide: PropTypes.number.isRequired,
    ready: PropTypes.bool.isRequired,
    // postHasScrolled: PropTypes.func.isRequired,
    // hiddenBars: PropTypes.bool.isRequired,
    // barsHaveShown: PropTypes.func.isRequired,
    // activeSlide: PropTypes.number.isRequired,
    currentList: PropTypes.shape({}).isRequired,
    carouselLists: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  static defaultProps = {
    media: null,
  };

  constructor(props) {
    super(props);

    this.latestScroll = 0;
    this.latestDirection = null;
  }

  componentDidMount() {
    const { active, allShareCountRequested, id } = this.props;

    if (active) setTimeout(() => allShareCountRequested({ id, wpType: 'posts' }), 500);
  }

  componentDidUpdate(prevProps) {
    const { active, allShareCountRequested, id } = this.props;

    if (active && !prevProps.active) {
      setTimeout(() => allShareCountRequested({ id, wpType: 'posts' }), 500);
    }
  }

  render() {
    const {
      active,
      id,
      media,
      slide,
      ready,
      currentList,
      carouselLists,
      // postHasScrolled,
      // hiddenBars,
      // barsHaveShown,
    } = this.props;

    return ready ? (
      <Container
      // onScroll={({ currentTarget }) => {
      //   // This function evaluates scroll distances, then bars are shown/hidden when needed.
      //   // Distance from top
      //   const top = currentTarget.scrollTop;
      //   // Distance from bottom
      //   const bottom = currentTarget.scrollHeight - screen.height - top;
      //
      //   const isScrollingUp = this.latestScroll < top;
      //
      //   // Shows top/bottom bars if the scroll is too close to the top/bottom.
      //   if (top < 60 || bottom < 120) {
      //     if (hiddenBars) barsHaveShown();
      //     // Shows/hiddes bars depending on scroll direction.
      //   } else if (isScrollingUp) {
      //     if (this.latestDirection !== 'up') postHasScrolled({ direction: 'up' });
      //
      //     this.latestDirection = 'up';
      //   } else if (this.latestDirection !== 'down') {
      //     postHasScrolled({ direction: 'down' });
      //
      //     this.latestDirection = 'down';
      //   }
      //
      //   this.latestScroll = top;
      // }}
      >
        <Placeholder active={active} />
        <Media id={media} lazy height="55vh" width="100%" />
        <Header id={id} active={active} />
        <Content
          id={id}
          type="post"
          slide={slide}
          // elementsToInject={[
          //   {
          //     index: 3,
          //     value: (
          //       <Carousel
          //         title="Te puede interesar..."
          //         size="small"
          //         listName="currentList"
          //         params={{ excludeTo: id, limit: 5 }}
          //       />
          //     ),
          //   },
          // ]}
        />
        <TagList id={id} />
        <Comments id={id} active={active} />
        <Carousel
          title="Siguientes artículos"
          size="small"
          type={currentList.type}
          id={currentList.id}
          params={{ excludeTo: id, limit: 5 }}
        />
        {carouselLists.map(({ title, ...list }) => (
          <Carousel
            key={title}
            title={`Más en ${title}`}
            size="medium"
            type={list.type}
            id={list.id}
            params={{ id: list.id, type: list.type, exclude: id, limit: 5 }}
          />
        ))}
        <SeoWord />
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
  lists: selectors.list.getLists(state).concat(selectors.list.getLists(state).slice(0, 2)),
});

const mapDispatchToProps = dispatch => ({
  allShareCountRequested: payload => dispatch(actions.shareModal.allShareCountRequested(payload)),
  shareModalOpeningRequested: payload => {
    dispatch(actions.shareModal.openingRequested(payload));
  },
  // postHasScrolled: options => dispatch(actions.postSlider.postHasScrolled(options)),
  // barsHaveShown: () => dispatch(actions.postSlider.barsHaveShown()),
});

    const single = connection.single.post[id];
    const ready = single && single.ready;
    const { listType, listId } = connection.selected.fromList;
    const index = lists.findIndex(item => item.type === listType && item.id === listId);
    const carouselLists = lists.slice(index, index + 3);
    const currentList = carouselLists.splice(0, 1)[0];

    if (ready) {
      return {
        ready,
        media: connection.single.post[id].featured.id,
        currentList,
        carouselLists,
      };
    }

    return {
      ready,
    };
  })(Post),
);

const Container = styled.div`
  box-sizing: border-box;
  padding-bottom: ${({ theme }) => theme.shareBarHeight};
  background-color: ${({ theme }) => theme.postLight};
  color: ${({ theme }) => theme.postDark};
  transition: padding-top 0.5s ease;
  z-index: 0;
  position: relative;
`;

const Placeholder = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.titleSize};
  background-color: ${({ theme, active }) => (active ? 'transparent' : theme.bgColor)};
`;

const SpinnerContainer = styled.div`
  width: 100%;
  height: 100vh;
`;
