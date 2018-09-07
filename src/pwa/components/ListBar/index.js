import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import Logo from './Logo';
import MenuButton from '../Menu/MenuButton';
import NotificationsButton from '../NotificationsButton';
import Nav from './Nav';

const ListBar = ({ isBarHidden, listBarHide }) => (
  <Fragment>
    <BarWrapper>
      <MenuButton component="List bar" />
      <Logo />
      <NotificationsButton />
    </BarWrapper>
    <NavWrapper isHidden={isBarHidden && listBarHide}>
      <Nav />
    </NavWrapper>
  </Fragment>
);

ListBar.propTypes = {
  isBarHidden: PropTypes.bool.isRequired,
  listBarHide: PropTypes.bool,
};

ListBar.defaultProps = {
  listBarHide: false,
};

export default inject(({ stores: { theme, settings } }) => {
  const listBar = settings.theme.listBar || {};

  return {
    isBarHidden: theme.scroll.isBarHidden,
    listBarHide: listBar.hide,
  };
})(ListBar);

const BarWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 60;
  height: ${({ theme }) => theme.heights.bar};
  width: 100%;
  display: flex;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
`;

const NavWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  top: ${({ theme }) => `calc(${theme.heights.bar} - 1px)`};
  z-index: 55;
  transform: translateY(
    ${({ theme, isHidden }) =>
      isHidden ? `calc(-${theme.heights.navbar} + 1px)` : 0}
  );
  transition: transform ${({ theme }) => theme.transitionTime}
    ${({ isHidden }) => (!isHidden ? 'ease' : 'ease')};
  box-shadow: ${({ theme }) => theme.shadows.top};
`;
