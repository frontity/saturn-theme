import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { inject } from "mobx-react";
import { dep } from "worona-deps";
import { compose } from "recompose";
import HeaderList from "../HeaderList";
import HeaderSingle from "../HeaderSingle";
import Column from "./Column";
import ShareBar from "../ShareBar";
import Slider from "../../elements/Swipe";
import * as actions from "../../actions";

class Context extends Component {
  static propTypes = {
    context: PropTypes.number.isRequired, // eslint-disable-line
    columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    selectedColumn: PropTypes.number.isRequired,
    bar: PropTypes.string.isRequired,
    ssr: PropTypes.bool.isRequired,
    routeChangeRequested: PropTypes.func.isRequired,
    windowHasScrolled: PropTypes.func.isRequired,
    barsHaveShown: PropTypes.func.isRequired,
    hiddenBars: PropTypes.bool.isRequired
  };

  constructor() {
    super();

    this.latestDirection = null;
    this.latestScroll = 0;

    this.renderColumn = this.renderColumn.bind(this);
    this.handleOnChangeIndex = this.handleOnChangeIndex.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    if (window) window.scrollTo(0, 0); // reset scroll when accessing a new context

    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUpdate(nextProps) {
    if (this.props.selectedColumn !== nextProps.selectedColumn) {
      this.latestDirection = null;
      this.latestScroll = 0;
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const { windowHasScrolled, barsHaveShown, hiddenBars } = this.props;

    // Distance from top.
    const top = window.scrollY;
    // Distance from bottom.
    const bottom = document.scrollingElement.offsetHeight - window.innerHeight - top;

    const isScrollingUp = this.latestScroll < top;

    // Shows top/bottom bars if the scroll is too close to the top/bottom.
    if (top < 60 || bottom < 120) {
      if (hiddenBars) barsHaveShown();
      // Shows/hiddes bars depending on scroll direction.
    } else if (isScrollingUp) {
      if (this.latestDirection !== "up") windowHasScrolled({ direction: "up" });

      this.latestDirection = "up";
    } else if (this.latestDirection !== "down") {
      windowHasScrolled({ direction: "down" });

      this.latestDirection = "down";
    }

    this.latestScroll = top;
  }

  handleOnChangeIndex({ index, fromProps }) {
    if (fromProps) return;

    const { routeChangeRequested, columns } = this.props;
    const { listId, listType, page, singleType, singleId } = columns[index].selected;
    const selected = {};

    if (singleType) {
      selected.singleType = singleType;
      selected.singleId = singleId;
    } else {
      selected.listType = listType;
      selected.listId = listId;
      selected.page = page;
    }

    routeChangeRequested({
      selected,
      method: "push"
    });
  }

  renderColumn(column, index) {
    const { selectedColumn, ssr } = this.props;

    if (index < selectedColumn - 1 || index > selectedColumn + 1) return <div key={index} />;

    if (selectedColumn !== index && ssr) return <div key={index} />;

    const { items } = column;

    return <Column key={index} items={items} active={selectedColumn === index} slide={index} />;
  }

  render() {
    const { columns, selectedColumn, bar } = this.props;

    return [
      bar === "list" && <HeaderList key="header-list" />,
      bar === "single" && <HeaderSingle key="header-single" />,
      <Slider key="slider" index={selectedColumn} onTransitionEnd={this.handleOnChangeIndex}>
        {columns.filter(({ selected }) => selected.id).map(this.renderColumn)}
      </Slider>,
      bar === "single" && <ShareBar key="share-bar" />
    ];
  }
}

const mapStateToProps = state => ({
  ssr: dep("build", "selectors", "getSsr")(state),
  hiddenBars: state.theme.bars.hidden
});

const mapDispatchToProps = dispatch => ({
  routeChangeRequested: payload =>
    dispatch(dep("connection", "actions", "routeChangeRequested")(payload)),
  windowHasScrolled: payload => dispatch(actions.scroll.windowHasScrolled(payload)),
  barsHaveShown: () => dispatch(actions.scroll.barsHaveShown())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  inject(({ connection }, { context }) => ({
    columns: connection.contexts[context].columns.slice()
  }))
)(Context);
