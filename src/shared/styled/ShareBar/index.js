/* eslint-disable import/prefer-default-export */
import styled from 'react-emotion';

export const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  height: ${({ theme }) => theme.heights.bar};
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 50;
  ${({ theme, isHidden, isAmp }) =>
    isAmp
      ? ''
      : `
    transform: translateY(${isHidden ? theme.heights.bar : 0});
    transition: transform 150ms ease;
  `};
  box-shadow: ${({ theme }) => theme.shadows.bottom};
  padding-left: 5px;
`;
