import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'react-emotion';
import MenuHeader from './MenuHeader';
import MenuList from './MenuList';

const Menu = ({ isOpen, close }) => (
  <Container isOpen={isOpen}>
    <Overlay isOpen={isOpen} onClick={close} onTouchMove={close} />
    <InnerContainer isOpen={isOpen}>
      <MenuHeader />
      <MenuList />
    </InnerContainer>
  </Container>
);

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default inject(({ stores: { theme } }) => ({
  isOpen: theme.menu.isOpen,
  close: theme.menu.close,
}))(Menu);

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: ${({ isOpen, theme }) =>
    isOpen ? '' : `visibility 0s ease-in ${theme.transitionTime}`};
  z-index: 150;
`;

const transitionCurve = ({ isOpen }) => (isOpen ? 'ease-out' : 'ease-in');

const Overlay = styled.div`
  filter: ${({ isOpen }) => (isOpen ? 'opacity(100%)' : 'opacity(0%)')};
  transition: filter ${({ theme }) => theme.transitionTime} ${transitionCurve};
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;

const InnerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateX(0%)' : 'translateX(-100%)'};
  width: 75vw;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  transition: transform ${({ theme }) => theme.transitionTime}
    ${transitionCurve};
  z-index: 151;
`;
